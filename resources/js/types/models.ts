export interface Profile {
    id: string;
    user_id: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    image_url?: string | null;
}

export interface User {
    id: string;
    username: string;
    email: string;
    profile?: Profile | null;
    role?: string | null;
}

export interface Supplier {
    id: number;
    name: string;
    phone?: string | null;
    tel?: string | null;
    email: string;
    address: string;
    tin: string;
    image_url?: string | null;
    image_file_id?: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}