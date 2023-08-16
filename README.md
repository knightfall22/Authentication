# Authentication API Readme

The Authentication API provides essential functionality for user authentication and profile management in your application. This readme will walk you through the various features and endpoints of the API, showcasing how to implement sign up, sign in, password management, and Google authentication.

## Base URL

`https://your-auth-api.com`

## Endpoints

### 1. Sign Up

Endpoint: `/signup`
Method: `POST`

Allows users to create a new account with their email and password.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

Response:
```json
{
  "message": "Account created successfully"
}
```

### 2. Sign In

Endpoint: `/signin`
Method: `POST`

Enables users to authenticate using their registered email and password.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

Response:
```json
{
  "token": "yourAuthTokenHere"
}
```

### 3. New Password

Endpoint: `/new-password`
Method: `POST`

Allows users to change their password after signing in.

Request Body:
```json
{
  "oldPassword": "oldPassword123",
  "newPassword": "newStrongPassword456"
}
```

Response:
```json
{
  "message": "Password changed successfully"
}
```

### 4. Password Reset

Endpoint: `/password-reset`
Method: `POST`

Enables users to request a password reset link via email.

Request Body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "Password reset instructions sent"
}
```

### 5. Get Profile

Endpoint: `/get-profile`
Method: `GET`
Authorization: Bearer Token

Retrieves the user's profile information.

Response:
```json
{
  "userId": "yourUserId",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 6. Google Authentication

Endpoint: `/auth/google`
Method: `POST`

Allows users to authenticate using their Google account.

Request Body:
```json
{
  "googleToken": "userGoogleTokenHere"
}
```

Response:
```json
{
  "token": "yourAuthTokenHere"
}
```

## Error Handling

In case of errors, the API will provide appropriate HTTP status codes and error messages to help you identify the issue. Make sure to handle these errors gracefully in your application.

## Security Considerations

1. Always use HTTPS to ensure secure communication.
2. Hash and salt user passwords before storing them in your database.
3. Use JWT tokens for authentication and authorization.
4. Implement rate limiting and account lockout mechanisms to prevent brute-force attacks.

## Conclusion

The Authentication API provides a robust set of endpoints to manage user authentication and profiles in your application. By implementing these functionalities, you can enhance the security and user experience of your platform. If you have any questions or encounter issues, please refer to our documentation or reach out to our support team at support@your-auth-api.com.
