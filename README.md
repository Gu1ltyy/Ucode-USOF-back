# Ucode-USOF-back

# To start server:<br>
    -npm start

Endpoints

# Authentication module:
  POST /api/auth/register: Register a new user. Required parameters are [login, password, fullName, email, avatar].<br>
  POST /api/auth/login: Log in a user. Required parameters are [login, password]. Only users with a confirmed email can sign in.<br>
  POST /api/auth/logout: Log out an authorized user.<br>
  POST /api/auth/password-reset: Send a reset link to the user's email. Required parameter is [email].<br>
  POST /api/auth/password-reset/<resetToken>: Changing password with token from [email].<br>
  GET /api/auth/refresh: Refresh token.<br>

# User Module:
  GET /api/users: Get all users.<br>
  GET /api/users/<user_id>: Get specified user data.<br>
  GET /api/users/<user_id>/posts: Get all posts by user with such id.<br>
  POST /api/users: Create a new user. Required parameters are [login, password, email, role]. This feature must be accessible only for admins.<br>
  PATCH /api/users/avatar: Upload user avatar.<br>
  PATCH /api/users/<user_id>: Update user data.<br>
  DELETE /api/users/<user_id>: Delete a user.<br>

# Post Module:
  GET /api/posts: Get all posts. This endpoint doesn't require any role, it is public. Implement pagination if there are too many posts.<br>
  GET /api/posts/<post_id>: Get specified post data. Endpoint is public.<br>
  GET /api/posts/<post_id>/comments: Get all comments for the specified post. Endpoint is public.<br>
  POST /api/posts/<post_id>/comments: Create a new comment. Required parameter is [content].<br>
  GET /api/posts/<post_id>/categories: Get all categories associated with the specified post.<br>
  GET /api/posts/<post_id>/like: Get all likes under the specified post.<br>
  POST /api/posts: Create a new post. Required parameters are [title, content, categories].<br>
  POST /api/posts/<post_id>/like: Create a new like under a post.<br>
  POST /api/posts/<post_id>/dislike: Create a new dislike under a post.<br>
  PATCH /api/posts/<post_id>: Update the specified post (its title, body, or category). It's accessible only for the creator of the post.<br>
  DELETE /api/posts/<post_id>: Delete a post.<br>
  DELETE /api/posts/<post_id>/like: Delete a like/dislike under a post.<br>

# Categories Module:
  GET /api/categories: Get all categories.<br>
  GET /api/categories/<category_id>: Get specified category data.<br>
  GET /api/categories/<category_id>/posts: Get all posts associated with the specified category.<br>
  POST /api/categories: Create a new category. Required parameter is [title].<br>
  PATCH /api/categories/<category_id>: Update specified category data.<br>
  DELETE /api/categories/<category_id>: Delete a category.<br>

# Comments Module:
  GET /api/comments/<comment_id>: Get specified comment data.<br>
  GET /api/comments/<comment_id>/like: Get all likes under the specified comment.<br>
  POST /api/comments/<comment_id>/like: Create a new like under a comment.<br>
  POST /api/comments/<comment_id>/dislike: Create a new dislike under a comment.<br>
  PATCH /api/comments/<comment_id>: Update specified comment data.<br>
  DELETE /api/comments/<comment_id>: Delete a comment.<br>
  DELETE /api/comments/<comment_id>/like: Delete a like/dislike under a comment.<br>
