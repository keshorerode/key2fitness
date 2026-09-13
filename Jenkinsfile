pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pull latest code from GitHub
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🔨 Building Docker images...'
                sh 'docker compose build --no-cache'
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
                // Wait for containers to start
                sh 'sleep 10'
                // Check backend
                sh 'curl -f http://localhost:5000/ping || exit 1'
                // Check frontend
                sh 'curl -f http://localhost:3000 || exit 1'
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
