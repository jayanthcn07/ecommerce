# BuyBuddy — MERN E-Commerce Platform

BuyBuddy is a full-stack e-commerce application built using the MERN stack. It provides a complete shopping workflow with product browsing, authentication, cart management, order handling, and an admin dashboard for managing the store.

The project was built to understand how a production-style e-commerce application is structured across the frontend, backend, database, authentication, and deployment layers.

## Features

* User registration and login
* JWT-based authentication
* Product browsing and search
* Product categorization
* Shopping cart management
* Order placement and order management
* Admin dashboard
* Admin product and store management
* Role-based access control
* Simulated payment flow
* Responsive UI for different screen sizes
* REST API based communication between frontend and backend

## Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* REST APIs

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend

## Architecture

The application follows a client-server architecture:

```text
React Frontend
      |
      | HTTP / REST API
      v
Express + Node.js Backend
      |
      v
MongoDB Atlas
```

Authentication is handled using JWT tokens. Protected API routes verify the authenticated user before allowing access to user-specific or admin-specific operations.

## Application Flow

### 1. Authentication

A user can create an account and log in through the React frontend.

The backend:

1. Validates the submitted credentials.
2. Hashes passwords using bcrypt before storing them.
3. Verifies credentials during login.
4. Generates a JWT after successful authentication.
5. Uses the token to authenticate subsequent protected requests.

### 2. Product Management

Products are stored in MongoDB and exposed through REST APIs.

The frontend retrieves product information from the backend and displays it through reusable React components.

Users can browse products and use the available product information to decide what they want to purchase.

### 3. Cart and Orders

The shopping flow is handled through the frontend and backend APIs:

```text
Browse Products
      ↓
Add to Cart
      ↓
Review Cart
      ↓
Checkout
      ↓
Payment Simulation
      ↓
Create Order
```

The backend handles the relevant data operations while MongoDB stores persistent application data.

### 4. Role-Based Access

The application distinguishes between regular users and administrators.

Authenticated users can access user-specific functionality, while administrative operations are protected and restricted to users with the appropriate role.

This prevents normal users from accessing store-management functionality.

## Project Structure

A simplified structure of the project is:

```text
BuyBuddy/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
│
└── README.md
```

> The exact folder structure may vary depending on the current version of the repository.

## API Design

The backend exposes REST endpoints for the main application resources, including:

* Authentication
* Products
* Users
* Cart
* Orders
* Administrative operations

Authentication and authorization middleware is used to protect endpoints that should not be publicly accessible.

## What I Worked On

The main goal of this project was to build the application end-to-end rather than only creating the UI.

I worked across:

* React frontend development
* REST API development with Node.js and Express
* MongoDB data modeling and database integration
* JWT authentication
* Password hashing
* Role-based authorization
* Cart and order workflows
* Admin functionality
* Frontend-backend integration
* Deployment and environment configuration

## Running Locally

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB / MongoDB Atlas account

### Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd BuyBuddy
```

### Backend setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

### Frontend setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will then run on the local development server shown by Vite.

## Environment Variables

Do not commit real credentials or secrets to GitHub.

Typical backend variables include:

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

If the frontend requires an API base URL, configure it through the appropriate Vite environment variable.

## Key Learning

This project gave me practical experience building a complete MERN application and understanding how the different layers work together — from the React UI and REST APIs to authentication, database operations, authorization, and deployment.

It also helped me understand that building a full-stack application involves much more than implementing individual features: the frontend, backend, database, security, error handling, and deployment all have to work together reliably.

## Author

**Jayanth CN**


