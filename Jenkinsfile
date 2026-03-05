pipeline {
    agent any

    // CI/CD pipeline for hospital management system
    // Builds backend and frontend automatically
    // Triggered on push to master
    
    environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
    }

    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }

        stage('Backend: install') {
            steps {
                dir('Backend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend: install & build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Build successful!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}



