pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                echo '🔨 Building Docker images...'
                sh 'COMPOSE_PARALLEL_LIMIT=1 docker compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping old containers...'
                sh 'docker compose down || true'
            }
        }

        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old Docker images...'
                sh 'docker image prune -f'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Starting containers...'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                // Retry for up to ~60s while containers start
                sh 'curl -f --retry 12 --retry-delay 5 --retry-connrefused http://localhost:5000/ping'
                sh 'curl -f --retry 12 --retry-delay 5 --retry-connrefused http://localhost:3000'
                echo '✅ All services are healthy!'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful! Site is live.'
        }
        failure {
            echo '❌ Deployment failed! Rolling back...'
            // If deploy fails, bring everything down to avoid half-broken state
            sh 'docker compose down || true'
        }
    }
}
