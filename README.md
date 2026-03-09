# Hospital Management System

A full-stack web application for managing hospital operations, including patients, doctors, appointments, beds, and medicines.

## Features

- Patient, Doctor, and Admin dashboards
- Appointment scheduling
- Bed and medicine management
- Real-time statistics
- Authentication with Firebase

## Tech Stack

- **Frontend**: React, Bootstrap, Firebase Auth
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **CI/CD**: GitHub Actions and Jenkins pipelines for automated building

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yavneet/hospital-management-system.git
   cd hospital-management-system
   ```

2. Backend setup:
   ```bash
   cd Backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run seed  # Optional: Seed the database
   npm start          # development server
   ```

   For production mode (serves frontend build as well):
   ```bash
   npm run start:prod
   ```

3. Frontend setup:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

### Environment Variables

Create `.env` in `Backend/` with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_key
```

## CI/CD

This project includes automated CI/CD pipelines:

- **GitHub Actions**: Runs on every push/PR to `master`, building backend and frontend.
- **Jenkins**: Configurable pipeline for local/on-premise CI/CD.

Both pipelines install dependencies and build the application without requiring credentials.

## Deployment

- **Frontend**: Automatically deployed to GitHub Pages on push to `master`.
- **Backend**: Automatically deployed to Heroku on push to `master` (requires Heroku secrets in GitHub).

To enable deployments:
1. Set up GitHub Pages in repo settings.
2. Create a Heroku app and add secrets in GitHub Actions.

## Usage

- Access the app at the deployed URLs or locally at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and create a PR

## License

ISC