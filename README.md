# WanderLust

WanderLust is a full-stack web application inspired by property and travel listing platforms, where users can explore, create, edit, and manage listings with secure authentication and authorization.

## Features

- User authentication and authorization
- Create, read, update, and delete listings
- Add and delete reviews
- Image upload for listings
- Session-based login system
- Flash messages for user feedback
- Form validation and error handling
- Protected routes for owners and authenticated users

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- EJS
- Bootstrap

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- Passport.js
- Express Session
- Cookies / Signed Cookies

### Other Tools
- Cloudinary (for image upload)
- JOI (for validation)
- Connect Flash
- Method Override

## Project Structure

```bash
WanderLust/
│
├── models/         # Database schemas and models
├── routes/         # Route definitions
├── controllers/    # Route handling logic
├── middleware/     # Custom middleware functions
├── views/          # EJS templates
├── public/         # Static files (CSS, JS, images)
├── utils/          # Utility functions / helpers
├── app.js          # Main server entry point
└── README.md
