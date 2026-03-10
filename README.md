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
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions and Jenkins pipelines for automated building and deployment

## Quick Start with Docker

### Prerequisites

- Docker & Docker Compose
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Yavneet/hospital-management-system.git
   cd hospital-management-system
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **MongoDB**: localhost:27017

### Production Deployment

1. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. Deploy using the production compose file:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. Or use the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Manual Setup (Development)

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

For Docker deployment, create `.env` in the root directory:
```
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password_here
JWT_SECRET=your_jwt_secret_here
```

## Docker Architecture

### Services

- **mongodb**: MongoDB database with persistent storage
- **backend**: Node.js/Express API server
- **frontend**: Nginx serving React application
- **nginx-proxy**: Optional reverse proxy for production

### Images

- Backend: `your-username/hospital-backend:latest`
- Frontend: `your-username/hospital-frontend:latest`

### Health Checks

All services include health checks for reliable deployments:
- Backend: `/health` endpoint
- Frontend: `/health` endpoint
- MongoDB: Database ping

## CI/CD Pipelines

### GitHub Actions

The GitHub Actions workflow:
- Builds Docker images for backend and frontend
- Pushes images to Docker Hub
- Triggers on push/PR to `master` branch
- Includes caching for faster builds

**Required Secrets:**
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

### Jenkins

The Jenkins pipeline:
- Builds Docker images locally
- Pushes to Docker Hub
- Includes cleanup steps
- Windows-compatible with `bat` commands

**Required Environment Variables:**
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

## Deployment Strategies

### Option 1: Docker Compose (Recommended)

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes

Use the included `docker-compose.prod.yml` as a reference for Kubernetes manifests.

### Option 3: Cloud Platforms

- **AWS ECS/Fargate**: Use the Docker images directly
- **Google Cloud Run**: Deploy containerized applications
- **Azure Container Instances**: Quick container deployment

## Monitoring & Health Checks

The application includes comprehensive health checks:

```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend health
curl http://localhost/health

# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

## Development Workflow

1. **Local Development**: Use `docker-compose up` for full environment
2. **Code Changes**: Edit code, containers auto-reload
3. **Testing**: Run tests in containers
4. **CI/CD**: Push to trigger automated builds
5. **Deployment**: Use deployment script or manual commands

## API Documentation

### Backend Endpoints

- `GET /health` - Health check
- `GET /api/patients` - Patient management
- `GET /api/doctors` - Doctor management
- `GET /api/appointments` - Appointment scheduling
- `GET /api/beds` - Bed management
- `GET /api/medicines` - Medicine inventory
- `GET /api/stats` - System statistics
- `POST /api/auth` - Authentication

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Memory issues**: Increase Docker memory allocation
3. **Build failures**: Check Docker daemon and internet connection
4. **Database connection**: Verify MongoDB credentials in `.env`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and create a PR
5. Ensure Docker builds pass

## License

ISC