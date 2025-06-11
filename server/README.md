# Iris Digital College - Backend API

This is the backend API for the Iris Digital College platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Role-based access control (Admin, Instructor, Student)
- Course management
- Application processing
- File uploads
- API security best practices
- Rate limiting
- Data sanitization
- XSS protection
- MongoDB for data storage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd iris-digital-college/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/iris_digital_college
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # Admin Default Credentials
   ADMIN_EMAIL=admin@irisdigital.com
   ADMIN_PASSWORD=admin123
   
   # File Upload
   MAX_FILE_UPLOAD=10
   FILE_UPLOAD_PATH=./public/uploads
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. Create the uploads directory:
   ```bash
   mkdir -p public/uploads
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get single user (Admin only)
- `POST /api/v1/users` - Create user (Admin only)
- `PUT /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Courses
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get single course
- `POST /api/v1/courses` - Create course (Admin/Instructor)
- `PUT /api/v1/courses/:id` - Update course (Admin/Instructor)
- `DELETE /api/v1/courses/:id` - Delete course (Admin/Instructor)

### Applications
- `GET /api/v1/applications` - Get all applications (Admin/Instructor)
- `GET /api/v1/applications/:id` - Get single application
- `POST /api/v1/courses/:courseId/applications` - Create application (Student)
- `PUT /api/v1/applications/:id/status` - Update application status (Admin/Instructor)
- `DELETE /api/v1/applications/:id` - Delete application (Admin)

### File Uploads
- `POST /api/v1/upload` - Upload file (Admin/Instructor)

## Security

- Authentication using JWT
- Password hashing with bcrypt
- Data sanitization
- XSS protection
- Rate limiting
- HTTP headers security
- MongoDB query protection

## Error Handling

The API returns appropriate HTTP status codes and JSON responses for different scenarios:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended for production)
2. Configure environment variables in your hosting platform
3. Install dependencies: `npm install --production`
4. Start the server: `npm start`

## License

This project is licensed under the MIT License.
