<?php

namespace App\Actions\Image;

use App\Models\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StoreAction
{
    public function __invoke($data)
    {
        try {
            DB::beginTransaction();

            $path = Storage::disk('public')->put('/Post', $data['image']);

            $imageName = basename($path);

            $image = Image::create(['path' => $imageName]);

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();

            throw new \Exception($exception->getMessage());
        }

        return $image;
    }
}
