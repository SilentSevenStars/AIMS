<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;
use Inertia\Support\Header;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user()?->load('profile'),
            ],
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function handle(Request $request, \Closure $next): Response
    {
        $response = parent::handle($request, $next);

        if ($request->header(Header::INERTIA) && $response->isRedirect()) {
            $location = $response->headers->get('Location');
            if ($location && $this->isExternalUrl($request, $location)) {
                return Inertia::location($location);
            }
        }

        return $response;
    }

    /**
     * Determine if the redirect URL is external to the current application host/port.
     */
    protected function isExternalUrl(Request $request, string $url): bool
    {
        // Protocol-relative or absolute URLs only
        if (! preg_match('/^(https?:)?\/\//i', $url)) {
            return false;
        }

        $targetHost = parse_url($url, PHP_URL_HOST);
        if (! $targetHost) {
            return false;
        }

        // Compare hostnames case-insensitively
        if (strcasecmp($targetHost, $request->getHost()) !== 0) {
            return true;
        }

        // Compare ports if different from default or mismatching request port
        $targetPort = parse_url($url, PHP_URL_PORT);
        $scheme = parse_url($url, PHP_URL_SCHEME) ?: $request->getScheme();
        $targetPort = $targetPort ?: ($scheme === 'https' ? 443 : 80);

        $requestPort = $request->getPort();
        $requestPort = $requestPort ?: ($request->getScheme() === 'https' ? 443 : 80);

        if ($targetPort !== $requestPort) {
            return true;
        }

        // Compare schemes
        $targetScheme = parse_url($url, PHP_URL_SCHEME);
        if ($targetScheme && strcasecmp($targetScheme, $request->getScheme()) !== 0) {
            return true;
        }

        return false;
    }
}
