# Ucode-USOF-back

# To start server:<br>
    -npm start

Endpoints

# Authentication module:
  POST /api/auth/register: Register a new user. Required parameters are [login, password, fullName, email, avatar].
  POST /api/auth/login: Log in a user. Required parameters are [login, password]. Only users with a confirmed email can sign in.
  POST /api/auth/logout: Log out an authorized user.
  POST /api/auth/password-reset: Send a reset link to the user's email. Required parameter is [email].
  POST /api/auth/password-reset/<resetToken>: Changing password with token from [email].
  GET /api/auth/refresh: Refresh token.

# User Module:
  GET /api/users: Get all users.
  GET /api/users/<user_id>: Get specified user data.
  GET /api/users/<user_id>/posts: Get all posts by user with such id.
  POST /api/users: Create a new user. Required parameters are [login, password, email, role]. This feature must be accessible only for admins.
  PATCH /api/users/avatar: Upload user avatar.
  PATCH /api/users/<user_id>: Update user data.
  DELETE /api/users/<user_id>: Delete a user.

# Post Module:
  GET /api/posts: Get all posts. This endpoint doesn't require any role, it is public. Implement pagination if there are too many posts.
  GET /api/posts/<post_id>: Get specified post data. Endpoint is public.
  GET /api/posts/<post_id>/comments: Get all comments for the specified post. Endpoint is public.
  POST /api/posts/<post_id>/comments: Create a new comment. Required parameter is [content].
  GET /api/posts/<post_id>/categories: Get all categories associated with the specified post.
  GET /api/posts/<post_id>/like: Get all likes under the specified post.
  POST /api/posts: Create a new post. Required parameters are [title, content, categories].
  POST /api/posts/<post_id>/like: Create a new like under a post.
  POST /api/posts/<post_id>/dislike: Create a new dislike under a post.
  PATCH /api/posts/<post_id>: Update the specified post (its title, body, or category). It's accessible only for the creator of the post.
  DELETE /api/posts/<post_id>: Delete a post.
  DELETE /api/posts/<post_id>/like: Delete a like/dislike under a post.

# Categories Module:
  GET /api/categories: Get all categories.
  GET /api/categories/<category_id>: Get specified category data.
  GET /api/categories/<category_id>/posts: Get all posts associated with the specified category.
  POST /api/categories: Create a new category. Required parameter is [title].
  PATCH /api/categories/<category_id>: Update specified category data.
  DELETE /api/categories/<category_id>: Delete a category.

# Comments Module:
  GET /api/comments/<comment_id>: Get specified comment data.
  GET /api/comments/<comment_id>/like: Get all likes under the specified comment.
  POST /api/comments/<comment_id>/like: Create a new like under a comment.
  POST /api/comments/<comment_id>/dislike: Create a new dislike under a comment.
  PATCH /api/comments/<comment_id>: Update specified comment data.
  DELETE /api/comments/<comment_id>: Delete a comment.
  DELETE /api/comments/<comment_id>/like: Delete a like/dislike under a comment.
