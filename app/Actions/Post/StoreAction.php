<?php

namespace App\Actions\Post;

use App\Actions\Image\PostStoreAction as ImageStoreAction;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class StoreAction
{

    public function __construct(private ImageStoreAction $imageStoreAction)
    {
    }

    public function __invoke($data)
    {
        try {
            DB::beginTransaction();

            $images = $data['images'];

            unset($data['images']);

            $post = Post::create($data);

            $this->imageStoreAction->handle($images, $post);

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new \RuntimeException($exception->getMessage());
        }

        return $post;
    }
}
