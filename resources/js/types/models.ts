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