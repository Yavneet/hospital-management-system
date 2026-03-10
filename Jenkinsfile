pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'
        BACKEND_IMAGE = "${DOCKER_USERNAME}/hospital-backend"
        FRONTEND_IMAGE = "${DOCKER_USERNAME}/hospital-frontend"
        DOCKER_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    bat "docker build -t ${env.BACKEND_IMAGE}:${env.DOCKER_TAG} -t ${env.BACKEND_IMAGE}:latest ./Backend"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    bat "docker build -t ${env.FRONTEND_IMAGE}:${env.DOCKER_TAG} -t ${env.FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    // Login to Docker Hub
                    bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"

                    // Push backend images
                    bat "docker push ${env.BACKEND_IMAGE}:${env.DOCKER_TAG}"
                    bat "docker push ${env.BACKEND_IMAGE}:latest"

                    // Push frontend images
                    bat "docker push ${env.FRONTEND_IMAGE}:${env.DOCKER_TAG}"
                    bat "docker push ${env.FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                script {
                    echo "🚀 Deploying to production..."
                    // Add your deployment commands here
                    // For example: update docker-compose, trigger webhook, etc.
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Clean up local images
                    bat "docker rmi ${env.BACKEND_IMAGE}:${env.DOCKER_TAG} || true"
                    bat "docker rmi ${env.FRONTEND_IMAGE}:${env.DOCKER_TAG} || true"
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up workspace
                cleanWs()
            }
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}