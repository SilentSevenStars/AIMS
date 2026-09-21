import SupplierForm from '@/components/form/supplier-form';

export default function Create() {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">New Supplier</h1>
            <SupplierForm />
        </div>
    );
}