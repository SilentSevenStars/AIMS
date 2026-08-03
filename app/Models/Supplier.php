<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'phone', 'tel', 'email', 'address', 'tin', 'image_url', 'active'])]
class Supplier extends Model
{
    public function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }
}
