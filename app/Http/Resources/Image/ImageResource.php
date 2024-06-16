<?php

namespace App\Http\Resources\Image;

use App\Http\Resources\Post\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\Image
 */
class ImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'path' => $this->path,
            'url' => Storage::url('Post/' . $this->path),
            'post_id' => $this->post_id,
            'post' => optional($this->whenLoaded('post'), function ($post) {
                return PostBasicResource::make($post)->resolve();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
