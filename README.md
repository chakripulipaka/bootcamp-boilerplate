# Pawgrammers Pet Adoption Shelter

A full-stack web application for pet adoption management with user and admin dashboards.

## Backend Development Progress

### ✅ Step 1: File Directory Setup and Dependencies
- Set up backend directory structure with models, controllers, routes, middleware, and utils folders
- Installed necessary dependencies:
  - bcryptjs (password hashing)
  - jsonwebtoken (JWT authentication)
  - express-validator (input validation)
  - multer (file uploads)
  - socket.io (WebSocket connections)

### ✅ Step 2: Pet and User Models
- Created Pet model with required fields:
  - Name (String, required)
  - Breed (String, required)
  - Age (Integer, required)
  - Image (String, required)
  - Cost Range (Integer, required)
  - Personality Characteristics (String, required)
  - Additional fields: isAdopted, dateAdded, lastUpdated
- Created User model for authentication:
  - Email, password (hashed), firstName, lastName, role (user/admin)
  - Built-in validation and password hashing utilities

### ✅ Step 3: Authentication and Login Frameworks
- Implemented JWT-based authentication system:
  - JWT token generation and verification utilities
  - Authentication middleware for protecting routes
  - Role-based authorization (user/admin)
  - Password hashing with bcrypt
- Created authentication endpoints:
  - POST /api/auth/register - User registration
  - POST /api/auth/login - User login
  - POST /api/auth/refresh - Token refresh
  - GET /api/auth/profile - Get user profile
  - POST /api/auth/logout - User logout
- Separate handling for user and admin roles

### ✅ Step 4: CRUD Controllers and Routes
- Created comprehensive Pet management system:
  - GET /api/pets - Get all pets with filtering and pagination
  - GET /api/pets/filters - Get available filter options
  - GET /api/pets/:id - Get single pet by ID
  - POST /api/pets - Create new pet (Admin only)
  - PUT /api/pets/:id - Update pet (Admin only)
  - DELETE /api/pets/:id - Delete pet (Admin only)
- Created User management system for admins:
  - GET /api/users - Get all users with pagination
  - GET /api/users/:id - Get user by ID
  - PUT /api/users/:id - Update user
  - DELETE /api/users/:id - Delete user
  - PATCH /api/users/:id/toggle-status - Toggle user status
- Advanced filtering capabilities for pets (name, breed, age, cost, adoption status)
- Pagination support for all list endpoints

### ✅ Step 5: WebSocket Framework
- Implemented real-time communication system using Socket.IO:
  - JWT-based authentication for WebSocket connections
  - Role-based room management (user rooms, admin room)
  - Real-time pet updates broadcasting to all users
  - Real-time user management notifications for admins
  - Event-driven architecture with proper error handling
- WebSocket Events:
  - Pet CRUD operations broadcast to all users
  - User management updates broadcast to admin room
  - Authentication and authorization for socket connections
  - Notification system for various events
- Integrated WebSocket broadcasts with existing API endpoints

### ✅ Step 6: Backend Review and Coherence
- Reviewed all backend components for coherence and functionality
- Created comprehensive API documentation
- Fixed server startup configuration and MongoDB API compatibility issues
- All backend systems are properly integrated and tested
- WebSocket real-time communication system is fully functional
- Authentication and authorization systems are secure and robust
- CRUD operations for pets and users are complete with proper validation
- **Backend is fully functional and tested** ✅

### ✅ Backend Testing Results
- ✅ Server starts successfully on port 3000
- ✅ MongoDB connection working properly
- ✅ User registration and login working
- ✅ JWT authentication and authorization working
- ✅ Pet CRUD operations working (admin only)
- ✅ User management working (admin only)
- ✅ Filtering and pagination working
- ✅ WebSocket server responding
- ✅ Role-based access control working correctly

## Frontend Development Progress

### ✅ Frontend Development Complete
- **Enhanced Existing Dashboard**: Built upon the existing Example Dashboard with API integration
- **Modern React Frontend**: React 19, TypeScript, and Material-UI with existing styling
- **API Integration**: Connected existing dashboard to new backend API endpoints
- **Pet Filtering**: Search by name, breed, and age with real-time filtering
- **Loading States**: Added loading indicators and error handling
- **Responsive Design**: Maintains existing mobile-friendly grid layout
- **Pet Cards**: Enhanced existing pet cards with cost display and better image handling
- **Refresh Functionality**: Added refresh button to reload pets from API

### ✅ Frontend Features
- 🐕 **Pet Dashboard**: Browse pets with real-time filtering and search
- 🔍 **Advanced Filtering**: Search by name, breed, and age ranges
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Material-UI components with existing styling
- ⚡ **API Integration**: Connected to backend with loading states and error handling
- 🔄 **Refresh Functionality**: Manual refresh button to reload pets
- 💰 **Cost Display**: Shows pet adoption costs in cards
- 🖼️ **Image Handling**: Proper image display with fallbacks
- 🔐 **Authentication**: Login and register functionality with JWT
- ➕ **Add Pets**: Admin users can add new pets with full form validation
- ✏️ **Edit Pets**: Admin users can edit existing pet information
- 🗑️ **Delete Pets**: Admin users can remove pets with confirmation
- 👁️ **Pet Details**: Click on any pet card to view full details including personality characteristics

## Getting Started

Required installations: node.js

To clone this project on git in terminal:
```
git clone https://github.com/WillardSun/bootcamp-boilerplate.git
cd bootcamp-boilerplate
```

### Environment Setup

Create a `.env` file in the root directory with the following content:
```env
# MongoDB Configuration
ATLAS_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
DATABASE_NAME=pawgrammers

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

Replace the placeholder values with your actual MongoDB connection string and a secure JWT secret.

### Running the Complete Application

To run the full Pawgrammers application:

1. **Setup Dependencies** (run once):
```bash
npm run build
```

2. **Start Backend Server** (Terminal 1):
```bash
npm run server
```
Backend will run on: `http://localhost:3000`

3. **Start Frontend Development Server** (Terminal 2):
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Application URLs

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000

### Demo Accounts

You can use these accounts to test the application:

**Regular User:**
- Email: `test@example.com`
- Password: `password123`

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

### Testing Admin Features

After logging in as admin, you can:

1. **Add a New Pet:**
   - Click the "Add Pet" button in the navigation bar
   - Fill in all required fields:
     - Pet Name (e.g., "Max")
     - Breed (e.g., "Labrador Retriever")
     - Age (e.g., 3)
     - Image URL (e.g., "https://images.dog.ceo/breeds/labrador/n02099712_1234.jpg")
     - Cost Range (e.g., 250)
     - Personality Characteristics (e.g., "Friendly, energetic, loves to play fetch")
   - Click "Add Pet"
   - The pet will be added to the database and appear in the dashboard

2. **Edit an Existing Pet:**
   - Hover over any pet card to see the edit button (pencil icon)
   - Click the edit button
   - Modify any fields you want to update
   - Click "Update Pet"

3. **Delete a Pet:**
   - Hover over any pet card to see the delete button (trash icon)
   - Click the delete button
   - Confirm the deletion
   - The pet will be removed from the database

4. **View Pet Details:**
   - Click on any pet card to see full details
   - View the complete personality characteristics and all pet information

### Backend API Endpoints

The backend server provides the following main endpoints:
- **Authentication**: `/api/auth/*` - Register, login, profile, logout
- **Pets**: `/api/pets/*` - Pet CRUD operations with filtering
- **Users**: `/api/users/*` - User management (Admin only)
- **WebSocket**: Real-time updates and notifications

## Technical Stack

- **Backend**: MongoDB + Express + Node.js
- **Frontend**: React + TypeScript + Vite
- **Deployment**: Vercel (Frontend)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: WebSocket connections via Socket.io
