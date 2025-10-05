<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // Import DB facade for settings

class PostController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::find($id);

        if (!$post) {
            // Return a JSON response with status 'Unknown' and HTTP status 404
            return response()->json([
                'status' => 'Unknown',
                'message' => 'Post not found'
            ], 404);
        }

        // For now, 'reservations' (zastrzeżenia) will be based on the post's status.
        // This logic can be expanded later based on linguistic algorithms and platform data.
        $reservations = [];
        if ($post->status === 'Fake news') {
            $reservations[] = ['type' => 'credibility', 'message' => 'This post has been identified as fake news.'];
        } elseif ($post->status === 'Nie wiadomo') {
            $reservations[] = ['type' => 'credibility', 'message' => 'The credibility of this post is unknown.'];
        }

        return response()->json([
            'post' => $post,
            'reservations' => $reservations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'postContent' => 'required|string',
            'external_id' => 'required|string|max:255|unique:posts,external_id', // Added unique validation for external_id
        ]);

        if ($validator->fails()) {
            // Check if the failure is due to a duplicate external_id
            if ($validator->errors()->has('external_id')) {
                // Try to find the existing post by external_id
                $existingPost = Post::where('external_id', $request->external_id)->first();
                if ($existingPost) {
                    // Return the existing post with its status
                    return response()->json(['message' => 'Post already exists', 'post' => $existingPost], 200);
                }
            }
            // If not a duplicate external_id or post not found (shouldn't happen with unique rule), return validation errors
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if review bombing is active
        $isReviewBombingActive = DB::table('settings')->where('key', 'is_review_bombing_active')->value('value');
        $isReviewBombingActive = json_decode($isReviewBombingActive); // Decode JSON value

        if ($isReviewBombingActive) {
            // If review bombing is active, mark the post for manual review and return
            $post = Post::create([
                'name' => $request->name,
                'username' => $request->username,
                'content' => $request->postContent,
                'published_at' => $request->publishedAt,
                'is_verified' => $request->isVerified ?? false,
                'views' => $request->views ?? 0,
                'comments' => $request->comments ?? 0,
                'reposts' => $request->reposts ?? 0,
                'likes' => $request->likes ?? 0,
                'bookmarks' => $request->bookmarks ?? 0,
                'related_profiles' => $request->relatedProfiles,
                'external_id' => $request->external_id, // Assign external_id
                'needs_manual_review' => true, // Mark for manual review
                // Status will be determined later or set to Unknown initially
                'status' => 'Unknown',
            ]);
            return response()->json(['message' => 'Post created and marked for manual review due to active review bombing.', 'post' => $post], 201);
        }

        // If review bombing is not active, proceed with normal creation and evaluation
        // Before creating a new post, check if review bombing needs to be activated.
        // This check should happen only if review bombing is NOT already active.
        $postEvaluator = new 
        App\Services\PostEvaluatorService();
        $postEvaluator->checkForReviewBombing(); // Check and potentially activate review bombing mode

        // Re-fetch the setting in case checkForReviewBombing activated it
        $isReviewBombingActive = DB::table('settings')->where('key', 'is_review_bombing_active')->value('value');
        $isReviewBombingActive = json_decode($isReviewBombingActive); // Decode JSON value

        if ($isReviewBombingActive) {
            // If review bombing was just activated, create the post with manual review flag
            $post = Post::create([
                'name' => $request->name,
                'username' => $request->username,
                'content' => $request->postContent,
                'published_at' => $request->publishedAt,
                'is_verified' => $request->isVerified ?? false,
                'views' => $request->views ?? 0,
                'comments' => $request->comments ?? 0,
                'reposts' => $request->reposts ?? 0,
                'likes' => $request->likes ?? 0,
                'bookmarks' => $request->bookmarks ?? 0,
                'related_profiles' => $request->relatedProfiles,
                'external_id' => $request->external_id, // Assign external_id
                'needs_manual_review' => true, // Mark for manual review
                'status' => 'Unknown',
            ]);
            return response()->json(['message' => 'Post created and marked for manual review due to newly detected review bombing.', 'post' => $post], 201);
        }

        // If review bombing is still not active, proceed with normal creation and evaluation
        $post = Post::create([
            'name' => $request->name,
            'username' => $request->username,
            'content' => $request->postContent,
            'published_at' => $request->publishedAt,
            'is_verified' => $request->isVerified ?? false,
            'views' => $request->views ?? 0,
            'comments' => $request->comments ?? 0,
            'reposts' => $request->reposts ?? 0,
            'likes' => $request->likes ?? 0,
            'bookmarks' => $request->bookmarks ?? 0,
            'related_profiles' => $request->relatedProfiles,
            'external_id' => $request->external_id, // Assign external_id
            // Pass necessary fields for evaluation, including external_id and initial status
            'status' => (new 
            App\Services\PostEvaluatorService())->evaluate(new Post($request->all() + ['external_id' => $request->external_id, 'needs_manual_review' => false, 'status' => 'Unknown'])), 
        ]);

        return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
    }

    public function evaluate(string $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $post->status = (new 
        App\Services\PostEvaluatorService())->evaluate($post);
        $post->save();

        return response()->json(['message' => 'Post re-evaluated successfully', 'post' => $post]);
    }
}