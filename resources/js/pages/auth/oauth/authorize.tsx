import { Head, useForm } from '@inertiajs/react';

interface Scope {
    id: string;
    description: string;
}

interface Client {
    id: string;
    name: string;
}

interface AuthorizeProps {
    authToken: string;
    client: Client;
    scopes: Scope[];
    request: { state?: string };
}

export default function Authorize({ authToken, client, scopes, request }: AuthorizeProps) {
    const approveForm = useForm({
        state: request.state ?? '',
        client_id: client.id,
        auth_token: authToken,
    });

    const denyForm = useForm({
        state: request.state ?? '',
        client_id: client.id,
        auth_token: authToken,
    });

    const approve = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post('/oauth/authorize');
    };

    const deny = (e: React.FormEvent) => {
        e.preventDefault();
        denyForm.delete('/oauth/authorize');
    };

    return (
        <>
            <Head title="Authorize" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Authorization request
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">{client.name}</span> is
                        requesting access to your account.
                    </p>

                    {scopes.length > 0 && (
                        <ul className="mt-4 space-y-2 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                            {scopes.map((scope) => (
                                <li key={scope.id} className="flex gap-2">
                                    <span style={{ color: '#008000' }}>✓</span>
                                    {scope.description}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-6 flex gap-3">
                        <form onSubmit={deny} className="flex-1">
                            <button
                                type="submit"
                                disabled={denyForm.processing}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Deny
                            </button>
                        </form>

                        <form onSubmit={approve} className="flex-1">
                            <button
                                type="submit"
                                disabled={approveForm.processing}
                                className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: '#008000' }}
                            >
                                Authorize
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}