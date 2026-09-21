import { useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Plus, Pencil, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Supplier } from '@/types/models';

DataTable.use(DT);

interface IndexProps {
    suppliers: Supplier[];
}

interface PageFlash {
    success?: string;
    error?: string;
}

// DataTables renders raw HTML strings, so lucide icons are pre-rendered to markup here
const iconHtml = (icon: React.ReactElement) => renderToStaticMarkup(icon);

export default function Index({ suppliers }: IndexProps) {
    const { flash } = usePage<{ flash: PageFlash }>().props;
    const tableRef = useRef(null);

    useEffect(() => {
        if (flash?.success) {
            console.log(flash.success);
        }
    }, [flash]);

    const columns = [
        {
            title: 'Image',
            data: 'image_url',
            orderable: false,
            render: (data: string | null) =>
                data
                    ? `<div class="avatar"><div class="w-10 rounded"><img src="${data}" /></div></div>`
                    : `<div class="avatar placeholder"><div class="w-10 rounded bg-base-300"></div></div>`,
        },
        { title: 'Name', data: 'name' },
        { title: 'Email', data: 'email' },
        { title: 'Phone', data: 'phone', defaultContent: '—' },
        { title: 'TIN', data: 'tin' },
        {
            title: 'Status',
            data: 'active',
            render: (active: boolean) =>
                active
                    ? `<span class="badge badge-success badge-outline">Active</span>`
                    : `<span class="badge badge-ghost">Archived</span>`,
        },
        {
            title: 'Actions',
            data: null,
            orderable: false,
            render: (row: Supplier) => `
                <div class="flex gap-1" data-id="${row.id}">
                    <button class="edit-btn btn btn-ghost btn-xs" title="Edit">
                        ${iconHtml(<Pencil size={14} />)}
                    </button>
                    <button class="toggle-btn btn btn-ghost btn-xs" title="${row.active ? 'Archive' : 'Restore'}">
                        ${row.active ? iconHtml(<Archive size={14} />) : iconHtml(<ArchiveRestore size={14} />)}
                    </button>
                    <button class="delete-btn btn btn-ghost btn-xs text-error" title="Delete">
                        ${iconHtml(<Trash2 size={14} />)}
                    </button>
                </div>
            `,
        },
    ];

    const handleTableClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const row = target.closest('[data-id]') as HTMLElement | null;
        if (!row) return;
        const id = row.dataset.id!;
        const btn = target.closest('button');
        if (!btn) return;

        if (btn.classList.contains('edit-btn')) {
            router.visit(route('supplier.edit', id));
        } else if (btn.classList.contains('delete-btn')) {
            if (confirm('Delete this supplier? This cannot be undone.')) {
                router.delete(route('supplier.destroy', id));
            }
        } else if (btn.classList.contains('toggle-btn')) {
            const supplier = suppliers.find((s) => s.id === Number(id));
            if (!supplier) return;
            const routeName = supplier.active ? 'supplier.archive' : 'supplier.restore';
            router.patch(route(routeName, id));
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Suppliers</h1>
                <Link href={route('supplier.create')} className="btn btn-primary gap-2">
                    <Plus size={16} />
                    Add Supplier
                </Link>
            </div>

            <div onClick={handleTableClick} className="overflow-x-auto">
                <DataTable
                    ref={tableRef}
                    data={suppliers}
                    columns={columns}
                    className="table w-full"
                    options={{ responsive: true }}
                />
            </div>
        </div>
    );
}