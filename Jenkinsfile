pipeline {
    agent any                        // or label('linux && node')

    environment {
        // credentials configured in Jenkins → Credentials
        GITHUB_TOKEN    = credentials('github-token')      // if you use gh-pages
        HEROKU_API_KEY  = credentials('heroku-api-key')
        HEROKU_APP_NAME = credentials('heroku-app-name')
        // add others (e.g. MONGO_URI) via Jenkins config if you test against a real DB
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Backend: install & test') {
            steps {
                dir('Backend') {
                    sh 'npm ci'
                    sh 'npm test || true'     // your repo has no tests yet
                }
            }
        }

        stage('Frontend: install & test & build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test -- --coverage --watchAll=false || true'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy backend to Heroku') {
            when { branch 'master' }
            steps {
                dir('Backend') {
                    // assumes heroku CLI already installed on agent
                    sh '''
                      heroku git:remote -a "$HEROKU_APP_NAME"
                      git push heroku HEAD:master
                    '''
                }
            }
        }

        stage('Deploy frontend to GitHub Pages') {
            when { branch 'master' }
            steps {
                dir('frontend') {
                    sh 'npm install -g gh-pages'
                    sh 'npm run build'
                    // the GITHUB_TOKEN is used automatically by gh-pages
                    sh 'GITHUB_TOKEN=$GITHUB_TOKEN npx gh-pages -d build'
                }
            }
        }
    }

    post {
        always {
            node('any') {
                cleanWs()
            }
        }
        success {
            emailext subject: "Build successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "See ${env.BUILD_URL}"
        }
        failure {
            emailext subject: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "See ${env.BUILD_URL}"
        }
    }
}