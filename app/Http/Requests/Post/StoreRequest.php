<?php

namespace App\Http\Requests\Post;

use App\Models\Image;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:5'],
            'images' => ['required', 'array'],
            'images.*' => [
                'required',
                'integer',
                'exists:' . Image::class . ',id'
            ],
        ];
    }
}
