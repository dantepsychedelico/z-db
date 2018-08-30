pipeline {
    agent any
    stages {
        stage('build with node:6') {
            agent { docker 'node:6.10' }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
    }
}
