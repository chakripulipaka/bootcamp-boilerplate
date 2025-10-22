# Pawgrammers Pet Adoption API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Access**: Public
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" // Optional, defaults to "user"
}
```

#### Login User
- **POST** `/api/auth/login`
- **Description**: Login user and get JWT token
- **Access**: Public
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Description**: Refresh JWT token
- **Access**: Public
- **Body**:
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### Get User Profile
- **GET** `/api/auth/profile`
- **Description**: Get current user profile
- **Access**: Private (requires authentication)

#### Logout User
- **POST** `/api/auth/logout`
- **Description**: Logout user
- **Access**: Private (requires authentication)

### Pet Routes (`/api/pets`)

#### Get All Pets
- **GET** `/api/pets`
- **Description**: Get all pets with optional filtering and pagination
- **Access**: Public (optional auth for personalized results)
- **Query Parameters**:
  - `name` (string): Filter by pet name (partial match)
  - `breed` (string): Filter by breed
  - `ageRange` (string): Filter by age range (puppy, young, adult, senior)
  - `costRange` (string): Filter by cost range (under100, 100-300, 300-500, over500)
  - `isAdopted` (boolean): Filter by adoption status
  - `page` (number): Page number for pagination (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `sortBy` (string): Sort field (default: dateAdded)
  - `sortOrder` (string): Sort order (asc/desc, default: desc)

#### Get Filter Options
- **GET** `/api/pets/filters`
- **Description**: Get available filter options for pets
- **Access**: Public

#### Get Pet by ID
- **GET** `/api/pets/:id`
- **Description**: Get a single pet by ID
- **Access**: Public

#### Create Pet (Admin Only)
- **POST** `/api/pets`
- **Description**: Create a new pet
- **Access**: Private (Admin only)
- **Body**:
```json
{
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age": 3,
  "image": "https://example.com/buddy.jpg",
  "costRange": 250,
  "personalityCharacteristics": "Friendly, energetic, good with kids"
}
```

#### Update Pet (Admin Only)
- **PUT** `/api/pets/:id`
- **Description**: Update a pet
- **Access**: Private (Admin only)
- **Body**: Same as create pet

#### Delete Pet (Admin Only)
- **DELETE** `/api/pets/:id`
- **Description**: Delete a pet
- **Access**: Private (Admin only)

### User Routes (`/api/users`) - Admin Only

#### Get All Users
- **GET** `/api/users`
- **Description**: Get all users with pagination and filtering
- **Access**: Private (Admin only)
- **Query Parameters**:
  - `page` (number): Page number for pagination
  - `limit` (number): Items per page
  - `role` (string): Filter by role (user/admin)

#### Get User by ID
- **GET** `/api/users/:id`
- **Description**: Get a single user by ID
- **Access**: Private (Admin only)

#### Update User
- **PUT** `/api/users/:id`
- **Description**: Update a user
- **Access**: Private (Admin only)

#### Delete User
- **DELETE** `/api/users/:id`
- **Description**: Delete a user
- **Access**: Private (Admin only)

#### Toggle User Status
- **PATCH** `/api/users/:id/toggle-status`
- **Description**: Toggle user active status
- **Access**: Private (Admin only)

## WebSocket Events

### Client to Server Events

#### Authenticate
- **Event**: `authenticate`
- **Payload**: `{ token: "jwt-token" }`

#### Pet Updated (Admin Only)
- **Event**: `pet_updated`
- **Payload**: Pet data object

#### Pet Created (Admin Only)
- **Event**: `pet_created`
- **Payload**: Pet data object

#### Pet Deleted (Admin Only)
- **Event**: `pet_deleted`
- **Payload**: Pet ID

#### User Updated (Admin Only)
- **Event**: `user_updated`
- **Payload**: User data object

### Server to Client Events

#### Authenticated
- **Event**: `authenticated`
- **Payload**: User information

#### Auth Error
- **Event**: `auth_error`
- **Payload**: Error message

#### Pet Updated
- **Event**: `pet_updated`
- **Payload**: Updated pet data

#### Pet Created
- **Event**: `pet_created`
- **Payload**: New pet data

#### Pet Deleted
- **Event**: `pet_deleted`
- **Payload**: Deleted pet ID

#### User Updated (Admin Room)
- **Event**: `user_updated`
- **Payload**: Updated user data

#### Notification
- **Event**: `notification`
- **Payload**: Notification data

#### Error
- **Event**: `error`
- **Payload**: Error message

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

## Success Responses

All endpoints return consistent success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## Pet Model Schema

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "breed": "String (required)",
  "age": "Number (required, integer)",
  "image": "String (required, URL or file path)",
  "costRange": "Number (required, integer)",
  "personalityCharacteristics": "String (required)",
  "isAdopted": "Boolean (default: false)",
  "dateAdded": "Date (auto-generated)",
  "lastUpdated": "Date (auto-updated)"
}
```

## User Model Schema

```json
{
  "_id": "ObjectId",
  "email": "String (required, unique)",
  "password": "String (required, hashed)",
  "firstName": "String (required)",
  "lastName": "String (required)",
  "role": "String (required, 'user' or 'admin')",
  "isActive": "Boolean (default: true)",
  "dateCreated": "Date (auto-generated)",
  "lastLogin": "Date (auto-updated)"
}
```

