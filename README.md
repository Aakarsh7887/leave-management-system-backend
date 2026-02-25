# Employee Leave Management & Reimbursement System

A complete MERN stack application featuring Role-Based Access Control (RBAC), allowing Employees to request leaves and submit reimbursement claims, which Managers or Admins can then review and approve/reject.

## Features
- **Authentication & Authorization**: Secure JWT-based auth with roles (Admin, Manager, Employee).
- **Leave Management**: Employees apply for leave, Managers approve/reject.
- **Reimbursement Module**: Submit expenses with URLs to receipts; Managers review.
- **Premium UI**: Handcrafted, fully responsive, glassmorphism-inspired dark mode using pure CSS (no Tailwind).

## Tech Stack
- **Frontend**: React.js (Vite), React Router v6, Axios, Context API, CSS3.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs.

## Project Structure
```
/backend
  /config         # Database connections
  /controllers    # Business logic functions
  /middleware     # JWT Auth and Error handling
  /models         # MongoDB Schemas
  /routes         # API endpoint definitions
  /utils          # Helper functions (e.g. tokenizer)
  server.js       # Entry point

/frontend
  /src
    /components   # UI Layouts & Dashboards
    /context      # React Context (Auth)
    /pages        # Top-level route pages (Login, Register, etc.)
    /utils        # Interceptors & Configs (Axios)
    App.jsx       # Main routing tree
    index.css     # Global aesthetic styling
```

## Setup & Installation

### Prerequisites
- Node.js installed (v16+)
- MongoDB connection string (Local or MongoDB Atlas)

### 1. Database Configuration
1. Navigate to the `backend/` directory.
2. Create a `.env` file in `backend/` and add the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### 2. Backend Setup
1. Open a terminal to the `backend/` directory:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. The server should start on `http://localhost:5000` assuming database connection succeeds.

### 3. Frontend Setup
1. Open a separate terminal to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. The React app will be served via Vite (usually on `http://localhost:5173`). Vite is configured to proxy `/api` requests to `localhost:5000`.

## Usage
1. Open the frontend URL in your browser.
2. Register a new user. You can select the Role during registration (Employee, Manager, Admin).
3. **Employee Flow**: Login -> Dashboard. You will see forms to submit Leave and Claims. Your history appears beneath the forms.
4. **Manager Flow**: Login -> Dashboard. You will see a combined list of all pending Leave Requests and Reimbursements, with actionable Approve/Reject buttons.

## Important Note
For actual production deployment, remove the role-selection from the registration form and assign roles strictly through secure Admin panels. This role-picker is included merely for easy demonstration purposes.
