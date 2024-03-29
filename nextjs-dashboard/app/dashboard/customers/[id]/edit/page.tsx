import { fetchCustomerById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/common/breadcrumbs";
import Form from "@/app/ui/customers/edit-form";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Update Customer',
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const customer = await fetchCustomerById(id);

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: "Customers", href: "/dashboard/customers"},
                {label: "Update Customer", href: `/dashboard/customers/${id}/edit`, active: true},
            ]} />
            <Form customer={customer} />
        </main>
    );
}