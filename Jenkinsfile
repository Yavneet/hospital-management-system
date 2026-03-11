pipeline {
    agent any

    environment {
        DOCKER_USERNAME = "avneetrao"
        BACKEND_IMAGE = "hospital-backend"
        FRONTEND_IMAGE = "hospital-frontend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                bat "docker build -t %DOCKER_USERNAME%/%BACKEND_IMAGE%:%DOCKER_TAG% -t %DOCKER_USERNAME%/%BACKEND_IMAGE%:latest ./Backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat "docker build -t %DOCKER_USERNAME%/%FRONTEND_IMAGE%:%DOCKER_TAG% -t %DOCKER_USERNAME%/%FRONTEND_IMAGE%:latest ./frontend"
            }
        }

        stage('Docker Login & Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {

                    bat "echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin"

                    bat "docker push %DOCKER_USERNAME%/%BACKEND_IMAGE%:%DOCKER_TAG%"
                    bat "docker push %DOCKER_USERNAME%/%BACKEND_IMAGE%:latest"

                    bat "docker push %DOCKER_USERNAME%/%FRONTEND_IMAGE%:%DOCKER_TAG%"
                    bat "docker push %DOCKER_USERNAME%/%FRONTEND_IMAGE%:latest"
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                bat "docker compose pull"
                bat "docker compose up -d"
            }
        }

        stage('Cleanup Images') {
            steps {
                bat "docker rmi %DOCKER_USERNAME%/%BACKEND_IMAGE%:%DOCKER_TAG% || exit 0"
                bat "docker rmi %DOCKER_USERNAME%/%FRONTEND_IMAGE%:%DOCKER_TAG% || exit 0"
            }
        }
    }

    post {
        success {
            echo "Build, Push and Deployment Successful!"
        }
        failure {
            echo "Pipeline Failed!"
        }
        always {
            cleanWs()
        }
    }
}