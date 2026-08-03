<?php

use App\Http\Controllers\Auth\AuthController;
use App\Models\User;
use Illuminate\Http\Request;

it('redirects guests to the login page when they open the dashboard', function () {
    $this->get('/')
        ->assertRedirect('/login');
});

it('allows authenticated users to view the dashboard', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'email' => 'testuser@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($user)
        ->get('/')
        ->assertOk();
});

it('redirects to the provided frontend URL after a successful login', function () {
    $controller = new class extends AuthController {
        public function buildRedirectResponsePublic(Request $request)
        {
            return $this->buildRedirectResponse($request);
        }
    };

    $request = Request::create('/login', 'POST', [
        'redirect' => 'http://localhost:3000/dashboard',
    ]);

    $request->setLaravelSession($this->app['session']->driver());

    config(['app.frontend_url' => 'http://localhost:3000']);

    $response = $controller->buildRedirectResponsePublic($request);
    expect($response->getTargetUrl())->toBe('http://localhost:3000/dashboard');
});

it('converts external redirects to inertia location for inertia requests', function () {
    Route::get('/_test_external_redirect', function () {
        return redirect()->away('https://external-domain.com/callback');
    })->middleware(\App\Http\Middleware\HandleInertiaRequests::class);

    $response = $this->get('/_test_external_redirect', [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => \Inertia\Inertia::getVersion(),
    ]);

    $response->assertStatus(409);
    $response->assertHeader('X-Inertia-Location', 'https://external-domain.com/callback');
});

