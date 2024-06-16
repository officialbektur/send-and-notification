<?php

namespace App\Http\Resources\Image;

use App\Http\Resources\Post\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\Image
 */
class ImageBasicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'path' => $this->path,
            'url' => asset(Storage::url('Post/' . $this->path)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
