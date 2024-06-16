<?php

namespace App\Http\Controllers\Image;

use App\Actions\Image\StoreAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Image\StoreRequest;
use App\Http\Resources\Image\ImageBasicResource;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request, StoreAction $action)
    {
        $data = $request->validated();

        $image = $action($data);

        return response()->json([
            'image' => ImageBasicResource::make($image)->resolve(),
        ], 201);
    }
}
