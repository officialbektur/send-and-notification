<?php

namespace App\Http\Resources\Post;

use App\Http\Resources\Image\ImageBasicResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Post
 */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'images' => ImageBasicResource::collection($this->images)->resolve(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
