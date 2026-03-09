pipeline {
    agent any

    environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
        // Defining ports based on your server.js and package.json defaults
        BACKEND_PORT = '5000' 
    }

    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }

        stage('Backend: Install') {
            steps {
                dir('Backend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend: Install & Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    // Start the backend in production mode; it also serves the frontend build
                    dir('Backend') {
                        bat "start /B npm run start:prod"
                    }

                    echo "🚀 Application is running!"
                    echo "Backend/Frontend: http://localhost:${env.BACKEND_PORT}"
                }
            }
        }
    }

    post {
        // Removed cleanWs() from 'always' because it would delete the 
        // production 'build' folder needed to keep the app running.
        success {
            echo "✅ Build and Deployment successful!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}