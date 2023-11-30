"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import Error from "next/error";
import { join } from "path";
import { writeFile } from "fs";

const FormInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please, enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormInvoiceSchema.omit({ id: true, date: true });
const UpdateInvoice = FormInvoiceSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevInvoiceState: InvoiceState, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
            `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return { message: "Database Error: Failed to Create Invoice." };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevInvoiceState: InvoiceState,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  // Prepare data for update into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");

    return { message: "Invoice Deleted." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

export async function authenticate(
  prevInvoiceState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialsSignin";
    }
    throw error;
  }
}

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const FormCustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(5, { message: "Please enter a name." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  image_url: z.any(),
});

const CreateCustomer = FormCustomerSchema.omit({ id: true });
const UpdateCustomer = FormCustomerSchema.omit({ id: true });

// This is temporary until @types/react-dom is updated
export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export async function createCustomer(prevCustomerState: CustomerState, formData: FormData) {
  
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url") as unknown as File,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  // Prepare data for insertion into the database
  const { name, email, image_url } = validatedFields.data;
  
  const bytes = await image_url.arrayBuffer();
  const image = Buffer.from(bytes);
  const path = join(process.cwd(), "public/customers", image_url.name);
  
  writeFile(path, image, (err) => {
    if (err) return { message: "Write File Error: Faild to Save the File", error: err.message };
  });

  // Insert data into the database
  try {
    await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${join("/customers", image_url.name).replace(/\\/g, '/')})
            `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return { message: "Database Error: Failed to Create Customer.", error: error.message };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}