import { FormEventHandler, useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface LoginProps {
    status?: string;
    redirect?: string;
}

export default function Login({ status, redirect: initialRedirect }: LoginProps) {
    const [redirectValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialRedirect ?? '';
        }

        const params = new URLSearchParams(window.location.search);

        return params.get('redirect') ?? initialRedirect ?? '';
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
        redirect: redirectValue,
    });

    // Fires for BOTH the password form (ValidationException on 'login')
    // and the Google callback redirect (withErrors(['login' => ...])) —
    // both land on the same `errors.login` key, so this single effect
    // catches every failure path.
    useEffect(() => {
        if (errors.login) {
            Swal.fire({
                icon: 'error',
                title: 'Sign in failed',
                text: errors.login,
                confirmButtonColor: '#008000',
            });
        }
    }, [errors.login]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen w-full flex-col md:flex-row">
                {/* Left panel — brand */}
                <div
                    className="flex w-full flex-col items-center justify-center px-8 py-10 md:h-auto md:w-1/2 md:py-0"
                    style={{ backgroundColor: '#008000' }}
                >
                    <img
                        src="/images/logo/clsu.png"
                        alt="CLSU logo"
                        className="h-20 w-auto md:h-32"
                    />
                    <p className="mt-6 max-w-xs text-center text-lg font-semibold tracking-wide text-white md:mt-8 md:max-w-sm md:text-2xl">
                        Asset Inventory Management System
                    </p>
                </div>

                {/* Right panel — form */}
                <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 md:w-1/2">
                    <div className="w-full max-w-sm">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to your account.
                        </p>

                        {status && (
                            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <a
                            href={`/auth/google/redirect${redirectValue ? `?redirect=${encodeURIComponent(redirectValue)}` : ''}`}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.46c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.58-5.17 3.58-8.83z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.28v3.11C3.25 21.3 7.31 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.28 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.6H1.28A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4-3.11z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l4 3.11c.95-2.83 3.6-4.96 6.72-4.96z"
                                />
                            </svg>
                            Sign in with CLSU Google account
                        </a>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-xs text-gray-400">or</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <form method="post" onSubmit={submit} className="mt-6 space-y-5">
                            <input type="hidden" name="redirect" value={redirectValue} />

                            <div>
                                <label
                                    htmlFor="login"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username or email
                                </label>
                                <input
                                    id="login"
                                    type="text"
                                    autoComplete="username"
                                    name="login"
                                    autoFocus
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#008000] focus:outline-none focus:ring-1 focus:ring-[#008000]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#008000] focus:outline-none focus:ring-1 focus:ring-[#008000]"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-[#008000] focus:ring-[#008000]"
                                />
                                Remember me
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: '#008000' }}
                            >
                                {processing ? 'Signing in…' : 'Log in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}