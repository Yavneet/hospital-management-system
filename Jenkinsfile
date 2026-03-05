pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }

        stage('Backend: install') {
            steps {
                dir('Backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend: install & build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
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




//     post {
//         always {
//             node('any') {
//                 cleanWs()
//             }
//         }
//         success {
//             emailext subject: "Build successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
//                     body: "See ${env.BUILD_URL}"
//         }
//         failure {
//             emailext subject: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
//                     body: "See ${env.BUILD_URL}"
//         }
//     }
}



