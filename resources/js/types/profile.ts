import type { User } from './models';

export interface Auth {
    user: User;
}

export interface PageProps {
    auth: Auth;
    [key: string]: unknown;
}
