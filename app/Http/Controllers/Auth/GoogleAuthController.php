<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class GoogleAuthController extends Controller
{
    /**
     * Allowed CLSU email domains.
     *
     * @var string[]
     */
    protected array $allowedDomains = [
        'clsu.edu.ph',
        'clsu2.edu.ph',
    ];

    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $redirect = trim((string) $request->query('redirect', ''));

        if ($this->isSafeRedirectTarget($redirect)) {
            $request->session()->put('auth.redirect', $redirect);
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google's callback.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidStateException $e) {
            return redirect()->route('login')->withErrors([
                'login' => 'Google sign-in failed. Please try again.',
            ]);
        }

        $email = $googleUser->getEmail();
        $domain = strtolower(substr(strrchr($email, '@'), 1));

        // 1. Domain check
        if (! in_array($domain, $this->allowedDomains, true)) {
            return redirect()->route('login')->withErrors([
                'login' => 'Only CLSU email accounts (@clsu.edu.ph or @clsu2.edu.ph) may sign in with Google.',
            ]);
        }

        // 2. Registration email check 
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'login' => 'This email is not registered in the system. Contact an administrator to request access.',
            ]);
        }

        Auth::login($user, remember: true);

        $redirect = $request->session()->pull('auth.redirect', '');

        if ($this->isSafeRedirectTarget($redirect)) {
            return $this->toRedirectResponse($redirect);
        }

        if ($request->session()->has('url.intended')) {
            return redirect()->intended(route('dashboard'));
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
}