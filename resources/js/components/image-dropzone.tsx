import { useCallback, useRef, useState, type DragEvent, type ChangeEvent, type MouseEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageDropzoneProps {
    initialPreview?: string | null;
    onChange: (file: File | null, removed?: boolean) => void;
    error?: string;
}

export default function ImageDropzone({ initialPreview = null, onChange, error }: ImageDropzoneProps) {
    const [preview, setPreview] = useState<string | null>(initialPreview);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File | undefined | null) => {
            if (!file || !file.type.startsWith('image/')) return;
            setPreview(URL.createObjectURL(file));
            onChange(file);
        },
        [onChange]
    );

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setPreview(null);
        onChange(null, true);
    };

    return (
        <div className="form-control">
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative flex h-48 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-box border-2 border-dashed transition ${
                    dragging ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-base-content/40'
                } ${error ? 'border-error' : ''}`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="h-full w-full rounded-box object-cover" />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="btn btn-circle btn-error btn-xs absolute -right-2 -top-2"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <>
                        <Upload size={28} className="text-base-content/40" />
                        <span className="px-4 text-center text-sm text-base-content/60">
                            Drag & drop an image, or click to browse
                        </span>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}