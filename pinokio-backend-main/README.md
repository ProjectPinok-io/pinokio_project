# Pinokio API Documentation

This document outlines the available API endpoints for the Pinokio application.

## Endpoints

### 1. Get Authenticated User

- **Endpoint:** `/api/user`
- **Method:** `GET`
- **Description:** Retrieves the currently authenticated user.
- **Authentication:** Requires Sanctum token (Bearer token in `Authorization` header).
- **Request:** None
- **Response:** JSON object representing the user, or 401 if not authenticated.

### 2. Create Post

- **Endpoint:** `/api/posts`
- **Method:** `POST`
- **Description:** Creates a new post.
- **Request Body (JSON):**
  ```json
  {
    "name": "string",
    "username": "string",
    "content": "string",
    "publishedAt": "datetime",
    "isVerified": "boolean",
    "views": "integer",
    "comments": "integer",
    "reposts": "integer",
    "likes": "integer",
    "bookmarks": "integer",
    "relatedProfiles": "array of strings"
  }
  ```
- **Response:** JSON object with a success message and the created post data, or 422 with validation errors.

### 3. Get Post by ID

- **Endpoint:** `/api/posts/{id}`
- **Method:** `GET`
- **Description:** Retrieves a specific post by its ID.
- **Request:** None
- **URL Parameters:**
    - `id` (integer): The ID of the post to retrieve.
- **Response:** JSON object containing the post and any associated reservations, or 404 if the post is not found.

### 4. Evaluate Post

- **Endpoint:** `/api/posts/{id}/evaluate`
- **Method:** `PUT`
- **Description:** Re-evaluates the credibility status of a post.
- **Request:** None
- **URL Parameters:**
    - `id` (integer): The ID of the post to evaluate.
- **Response:** JSON object with a success message and the updated post data, or 404 if the post is not found.

### 5. Submit Evaluation

- **Endpoint:** `/api/evaluations`
- **Method:** `POST`
- **Description:** Submits a user evaluation for a post.
- **Request Body (JSON):**
  ```json
  {
    "post_id": "integer",
    "user_id": "integer" (nullable),
    "evaluation": "string" (e.g., "Valid", "Warning", "Unknown")
  }
  ```
- **Response:** JSON object with a success message, the submitted evaluation, and the updated post status, or 422 with validation errors.

### 6. Submit Report

- **Endpoint:** `/api/reports`
- **Method:** `POST`
- **Description:** Submits a user report for a post.
- **Request Body (JSON):**
  ```json
  {
    "post_id": "integer",
    "user_id": "integer" (nullable),
    "reason": "string" (optional)
  }
  ```
- **Response:** JSON object with a success message and the submitted report, or 422 with validation errors.