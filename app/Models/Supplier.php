<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'phone', 'tel', 'email', 'second_email', 'address', 'tin', 'image_url', 'active'])]
class Supplier extends Model
{
    
}
