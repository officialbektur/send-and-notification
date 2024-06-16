<?php

namespace App\Actions\Image;

use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostStoreAction
{
    public function handle($imageIds, Post $post)
    {
        try {
            DB::beginTransaction();

            $savedImages = $post->images()->sync($imageIds);

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();

            throw new \RuntimeException($exception->getMessage());
        }

        return $savedImages;
    }
}
