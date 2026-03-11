pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "hospital-backend"
        FRONTEND_IMAGE = "hospital-frontend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
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
                    bat "docker build -t %DOCKER_USERNAME%/${BACKEND_IMAGE}:${DOCKER_TAG} -t %DOCKER_USERNAME%/${BACKEND_IMAGE}:latest ./Backend"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    bat "docker build -t %DOCKER_USERNAME%/${FRONTEND_IMAGE}:${DOCKER_TAG} -t %DOCKER_USERNAME%/${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {

                        bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"

                        bat "docker push %DOCKER_USERNAME%/${BACKEND_IMAGE}:${DOCKER_TAG}"
                        bat "docker push %DOCKER_USERNAME%/${BACKEND_IMAGE}:latest"

                        bat "docker push %DOCKER_USERNAME%/${FRONTEND_IMAGE}:${DOCKER_TAG}"
                        bat "docker push %DOCKER_USERNAME%/${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    bat "docker rmi %DOCKER_USERNAME%/${BACKEND_IMAGE}:${DOCKER_TAG} || exit 0"
                    bat "docker rmi %DOCKER_USERNAME%/${FRONTEND_IMAGE}:${DOCKER_TAG} || exit 0"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build and push successful!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            cleanWs()
        }
    }
}