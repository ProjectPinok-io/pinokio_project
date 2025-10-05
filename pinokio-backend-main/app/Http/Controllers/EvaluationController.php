<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EvaluationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'nullable|integer',
            'evaluation' => 'required|in:Valid,Warning,Unknown',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $evaluation = Evaluation::create([
            'post_id' => $request->post_id,
            'user_id' => $request->user_id,
            'evaluation' => $request->evaluation,
        ]);

        $post = $evaluation->post;

        if ($request->evaluation === 'Valid') {
            $post->increment('positive_evaluations_count');
        } else {
            $post->increment('negative_evaluations_count');
        }

        $post->status = $post->calculateCredibilityStatus();
        $post->save();

        return response()->json(['message' => 'Evaluation submitted successfully', 'evaluation' => $evaluation, 'post_status' => $post->status], 201);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}