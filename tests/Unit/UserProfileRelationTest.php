<?php

use App\Models\User;

test('user exposes a profile relationship for inertia sharing', function () {
    expect(method_exists(User::class, 'profile'))->toBeTrue();
});
