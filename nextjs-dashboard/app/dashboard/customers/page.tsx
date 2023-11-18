import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from 'react';
import CustomerTable from '@/app/ui/customers/table';
import { Metadata } from 'next';
import { fetchFilteredCustomers } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateCustomer } from "@/app/ui/customers/buttons";
import Breadcrumbs from "@/app/ui/common/breadcrumbs";

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Page({ searchParams, }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  
  return (
    <div className="w-full">
      <Breadcrumbs breadcrumbs={[
        { label: 'Customers', href: '/dashboard/customers', active: true }
      ]} />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <CustomerTable query={query} currentPage={currentPage} />
      </Suspense>
      {/* <div className="mt-5 w-full justify-center">
                <Pagination totalPages={customers.length} />
            </div> */}
    </div>
  );
};