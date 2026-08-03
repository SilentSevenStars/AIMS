<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show the login page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'status' => session('status'),
            'redirect' => $request->query('redirect'),
        ]);
    }
 
    /**
     * Handle a login attempt.
     *
     * Accepts either the username or the email in the same "login" field.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);
 
        $field = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
 
        if (! Auth::attempt(
            [$field => $credentials['login'], 'password' => $credentials['password']],
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'login' => 'These credentials do not match our records.',
            ]);
        }
 
        $request->session()->regenerate();

        return $this->buildRedirectResponse($request);
    }

    protected function buildRedirectResponse(Request $request): RedirectResponse
    {
        $redirect = trim((string) ($request->input('redirect') ?? $request->query('redirect') ?? ''));

        if ($this->isSafeRedirectTarget($redirect)) {
            return $this->toRedirectResponse($redirect);
        }

        $intended = $request->session()->pull('url.intended');

        if (is_string($intended) && $intended !== '') {
            return $this->toRedirectResponse($intended);
        }

        $frontendUrl = trim((string) config('app.frontend_url', ''));

        return $frontendUrl !== ''
            ? redirect()->away($frontendUrl)
            : redirect()->route('dashboard');
    }

    protected function toRedirectResponse(string $redirect): RedirectResponse
    {
        return str_starts_with($redirect, 'http')
            ? redirect()->away($redirect)
            : redirect()->to($redirect);
    }

    protected function isSafeRedirectTarget(string $redirect): bool
    {
        if ($redirect === '') {
            return false;
        }

        if (str_starts_with($redirect, '/')) {
            return true;
        }

        if (! filter_var($redirect, FILTER_VALIDATE_URL)) {
            return false;
        }

        $allowedHosts = array_filter(array_map('trim', explode(',', (string) env('APP_ALLOWED_REDIRECT_HOSTS', ''))));
        $allowedHosts[] = parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST);
        $allowedHosts[] = parse_url((string) config('app.frontend_url', ''), PHP_URL_HOST);
        $allowedHosts[] = 'localhost';
        $allowedHosts[] = '127.0.0.1';
        $allowedHosts[] = '::1';
        $allowedHosts = array_unique(array_filter($allowedHosts));

        $requestedHost = parse_url($redirect, PHP_URL_HOST);

        return $requestedHost !== null && in_array($requestedHost, $allowedHosts, true);
    }
 
    /**
     * Log the user out.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
 
        $request->session()->invalidate();
        $request->session()->regenerateToken();
 
        return redirect('/login');
    }
}
