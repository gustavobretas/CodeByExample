import { lusitana } from "@/app/ui/fonts"
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from 'react';
import Table from '@/app/ui/invoices/table';
import { fetchInvoicesPages } from "@/app/lib/data";
import Pagination from "@/app/ui/invoices/pagination";
import { Metadata } from 'next';
import Breadcrumbs from "@/app/ui/common/breadcrumbs";

export const metadata: Metadata = {
    title: 'Invoices',
}

export default async function Page({ searchParams, }: { searchParams?: { query?: string; page?: string } }) {
    const query = searchParams?.query ?? '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query)

    return (
        <div className="w-full">
            <Breadcrumbs breadcrumbs={[
                { label: 'Invoices', href: '/dashboard/invoices', active: true }
            ]} />
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
                <CreateInvoice />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};