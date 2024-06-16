<?php

namespace App\Http\Requests\Image;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'image' => ['required',
                 File::image()
                     ->types(['jpeg', 'png', 'jpg'])
                     ->min('1kb')
                     ->max('5mb')
            ],
        ];
    }
}
