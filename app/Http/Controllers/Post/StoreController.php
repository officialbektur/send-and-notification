<?php

namespace App\Http\Controllers\Post;

use App\Actions\Post\StoreAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StoreRequest;
use App\Http\Resources\Post\PostResource;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request, StoreAction $action)
    {
        $data = $request->validated();

        $post = $action($data);
        return response()->json([
            'post' => PostResource::make($post)->resolve(),
        ], 201);
    }
}
