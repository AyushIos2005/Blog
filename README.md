CodeHub

A full-stack developer-focused social platform where users can create and share posts, interact with other users, manage profiles, and discover content.

CodeHub is built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend. Authentication uses JWT with an HTTP-only cookie, while ImageKit is used for media uploads.

✨ Features

Authentication & Security

User registration and login

OTP verification

JWT-based authentication

HTTP-only authentication cookie

Protected routes

Get current authenticated user

Logout

Change password

Forgot password

Reset password using OTP

Posts

Create posts with image/file upload

Add title and description

Add tags

View posts

Edit your own posts

Delete your own posts

Like posts

Comment on posts

View post comments

Post detail page

Profiles

Create a personal profile

Upload profile image

Edit profile

Delete profile

View profile details

Bio, profession and education information

Social media links

Date of birth and calculated age

Gender selection

Frontend Experience

Responsive React interface

Protected application routes

Authentication context

Home feed

Explore page

Create post page

Post detail page

Profile management

Network page

Notifications page

Saved page

Settings page

Mobile tab navigation

Tailwind CSS styling

Lucide icons

🛠️ Tech Stack

Frontend

React 19

Vite

React Router

Axios

Tailwind CSS

Lucide React

Oxlint

Backend

Node.js

Express 5

MongoDB

Mongoose

JWT

Cookie Parser

Multer

Nodemailer

ImageKit

dotenv

📁 Project Structure

codehub-project/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── endpoints.js
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── app.js
│   │   └── db/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── render.yaml

🚀 Getting Started

Prerequisites

Make sure you have installed:

Node.js

npm

MongoDB or MongoDB Atlas

An ImageKit account for image/file uploads

SMTP/email credentials if email OTP functionality is enabled

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd codehub-project

2. Setup Backend

cd backend
npm install

Create a .env file in the backend directory.

Example:

PORT=3000
NODE_ENV=development

MON_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_KEY=your_imagekit_url_endpoint

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_email

Never commit .env or other secrets to GitHub.

Start the backend:

node server.js

The API runs on:

http://localhost:3000

3. Setup Frontend

Open a new terminal:

cd frontend
npm install

Create a .env file:

VITE_API_BASE_URL=http://localhost:3000

Start the frontend:

npm run dev

The Vite development server normally runs on:

http://localhost:5173

🔐 Authentication Flow

CodeHub uses cookie-based JWT authentication.

Register
   ↓
OTP Verification
   ↓
Login
   ↓
JWT stored in HTTP-only cookie
   ↓
Protected API requests
   ↓
Logout

Protected frontend pages are handled through ProtectedRoute, while backend authorization is handled through authentication middleware.

💬 Messaging — Planned Feature

Messaging is the next major feature planned for CodeHub. It will be implemented before the production deployment.

Planned Architecture

React Frontend
      │
      ├── REST API ──→ Express ──→ MongoDB
      │
      └── Socket.IO
             │
             ▼
        Node / Express
             │
             ▼
          MongoDB

Messaging Goals

One-to-one real-time messaging

Conversation list

Message history

Real-time message delivery

Message timestamps

Online/offline status

Typing indicator

Read/unread status

Unread message count

Message pagination

Message deletion/editing

Image/file messages as a future enhancement

Planned Database Design

Conversation

{
    _id,
    participants: [userId1, userId2],
    lastMessage,
    lastMessageAt,
    createdAt,
    updatedAt
}

Message

{
    _id,
    conversationId,
    senderId,
    receiverId,
    text,
    messageType,
    isRead,
    createdAt,
    updatedAt
}

Messages will be stored as separate MongoDB documents instead of embedding an unlimited number of messages inside a conversation document. This keeps the system scalable and makes pagination easier.

REST API Responsibilities

REST APIs will handle operations such as:

Create/find conversations

Get the current user's conversations

Get conversation message history

Paginate older messages

Delete/edit messages

Mark messages as read

Socket.IO Responsibilities

Socket.IO will handle real-time operations such as:

connection
disconnect
join_conversation
send_message
receive_message
typing_start
typing_stop
message_read
user_online
user_offline

Authentication

Messaging will use the existing CodeHub authentication system.

User Login
    ↓
JWT Authentication
    ↓
HTTP API Authentication
    │
    └── Socket.IO Authentication

The backend will identify the sender from the authenticated user/session instead of trusting a senderId supplied by the client.

Recommended Implementation Order

1. Design Conversation + Message schemas
              ↓
2. Create conversation/message REST APIs
              ↓
3. Add MongoDB indexes
              ↓
4. Add Socket.IO server
              ↓
5. Authenticate Socket.IO connections
              ↓
6. Implement one-to-one real-time messaging
              ↓
7. Build conversation list UI
              ↓
8. Build chat window UI
              ↓
9. Add pagination
              ↓
10. Add read/unread status
              ↓
11. Add typing indicator
              ↓
12. Add online/offline status
              ↓
13. Test edge cases and security
              ↓
14. Production deployment

Senior Developer / Learning Resources

Before implementing messaging, understand the underlying concepts instead of copying a tutorial architecture.

WebSocket fundamentals: MDN WebSocket API

MongoDB data modeling: MongoDB Data Modeling Best Practices

Socket.IO: Socket.IO Documentation

MongoDB: MongoDB Documentation

Production Checklist

Messaging will be completed and tested before deploying CodeHub to production.

One-to-one messaging works

Socket authentication works

Messages persist in MongoDB

Conversation history is paginated

MongoDB indexes are configured

Read/unread state works

Typing indicator works

Online/offline state works

Unauthorized socket connections are rejected

Client/server disconnects are handled

Error handling is implemented

CORS is configured for production

Secure cookies are configured

Environment variables are configured

Production frontend and backend are tested

Real-time messaging is tested after deployment

Development approach: Build the messaging feature incrementally, test each layer independently, and deploy only after the complete application has been tested in a production-like environment.

🔌 API Overview

Authentication

Method

Endpoint

Description

POST

/api/auth/register

Register a user

POST

/api/auth/verify-otp

Verify OTP

POST

/api/auth/login

Login

GET

/api/auth/get-me

Get authenticated user

POST

/api/auth/logout

Logout

POST

/api/auth/change-password

Change password

POST

/api/auth/forget-password

Request password reset

POST

/api/auth/reset-password

Reset password

Posts

Method

Endpoint

Description

GET

/api/post/

Get all posts

POST

/api/post/post

Create a post

PATCH

/api/post/postupdate/:id

Update a post

DELETE

/api/post/post/:id

Delete a post

POST

/api/post/post/:id/like

Like/unlike a post

POST

/api/post/post/:id/comment

Add a comment

GET

/api/post/post/:id/comment

Get comments

Profiles

Method

Endpoint

Description

POST

/api/profile/createProfile

Create profile

PATCH

/api/profile/updateProfile/:id

Update profile

DELETE

/api/profile/deleteProfile/:id

Delete profile

GET

/api/profile/profile-detail

Get current user's profile

🖼️ File Uploads

CodeHub uses Multer to receive uploaded files and ImageKit for cloud storage.

Typical flow:

Frontend
   ↓
Multipart/FormData
   ↓
Multer
   ↓
Backend Controller
   ↓
ImageKit
   ↓
Cloud File URL
   ↓
MongoDB

🗄️ Database Models

The backend currently contains models for:

User

Profile

Post

Comment

OTP

Posts are associated with users through MongoDB ObjectId references.

🌐 Deployment

The project includes a render.yaml configuration for deploying the frontend and backend on Render.

Backend

The backend service is configured to:

Build: npm install
Start: node server.js
Root: backend

Frontend

The frontend service is configured to:

Build: npm install && npm run build
Publish: ./dist
Root: frontend

Set the production frontend API URL in Render:

VITE_API_BASE_URL=https://your-backend-url

For the backend, configure production secrets in the Render Environment settings.

Also update:

FRONTEND_URL=https://your-frontend-url

so the backend accepts requests from the deployed frontend.

🧪 Useful Commands

Frontend

npm run dev
npm run build
npm run preview
npm run lint

Backend

npm install
node server.js

For development, you can also use Nodemon:

npx nodemon server.js

🔒 Security Notes

Do not commit .env files.

Use a strong random JWT_KEY.

Keep ImageKit private keys secret.

Keep SMTP credentials secret.

Use HTTPS in production.

Configure FRONTEND_URL correctly in production.

Use secure cookie settings when deploying behind HTTPS.

Validate uploaded files and file sizes before accepting them in production.

📌 Future Improvements

Potential production enhancements:

Search and advanced content filtering

Follow/unfollow system

Real-time notifications

Direct messaging

Pagination/infinite scrolling

Post bookmarking persistence

Better feed recommendation algorithm

Rate limiting

Request validation with Zod/Joi

Centralized error handling

API documentation with Swagger/OpenAPI

Automated tests

CI/CD pipeline

Redis caching

Production logging and monitoring

👨‍💻 Author

Ayush Verma

Built as a full-stack web application using modern JavaScript technologies.

📄 License

This project is available for learning and development purposes. Add an appropriate open-source license before distributing the project publicly.
