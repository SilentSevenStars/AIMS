<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'username' => 'admin',
            'email' => 'josephmatthew_ringor@clsu.edu.ph',
            'password' => '12345678',
        ]);

        Profile::create([
            'user_id' => $user->id,
            'first_name' => 'Test',
            'last_name' => 'Admin',
        ]);
    }
}
