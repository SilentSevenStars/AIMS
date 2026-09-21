import { useForm } from '@inertiajs/react';
import { type ChangeEvent, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import ImageDropzone from '../image-dropzone';
import type { Supplier } from '@/types/models';

interface SupplierFormData {
    name: string;
    phone: string;
    tel: string;
    email: string;
    address: string;
    tin: string;
    image: File | null;
    remove_image: boolean;
    _method: 'post' | 'put';
    [key: string]: any;
}

interface SupplierFormProps {
    supplier?: Supplier | null;
}

export default function SupplierForm({ supplier = null }: SupplierFormProps) {
    const isEdit = !!supplier;

    const { data, setData, post, processing, errors } = useForm<SupplierFormData>({
        name: supplier?.name ?? '',
        phone: supplier?.phone ?? '',
        tel: supplier?.tel ?? '',
        email: supplier?.email ?? '',
        address: supplier?.address ?? '',
        tin: supplier?.tin ?? '',
        image: null,
        remove_image: false,
        _method: isEdit ? 'put' : 'post',
    });

    const handleImageChange = (file: File | null, removed = false) => {
        setData((prev) => ({
            ...prev,
            image: file,
            remove_image: removed,
        }));
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = isEdit ? route('supplier.update', supplier!.id) : route('supplier.store');
        post(url, { forceFormData: true });
    };

    return (
        <form onSubmit={submit} className="max-w-xl space-y-4">
            <ImageDropzone
                initialPreview={supplier?.image_url ?? null}
                onChange={handleImageChange}
                error={errors.image}
            />

            <Field label="Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} />
            <Field label="Email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} />
            <Field label="Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} />
            <Field label="Tel" value={data.tel} onChange={(v) => setData('tel', v)} error={errors.tel} />
            <Field label="Address" value={data.address} onChange={(v) => setData('address', v)} error={errors.address} />
            <Field label="TIN" value={data.tin} onChange={(v) => setData('tin', v)} error={errors.tin} />

            <button type="submit" disabled={processing} className="btn btn-primary gap-2">
                <Save size={16} />
                {isEdit ? 'Update Supplier' : 'Create Supplier'}
            </button>
        </form>
    );
}

interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

function Field({ label, value, onChange, error }: FieldProps) {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}