pipeline {
    agent { docker { image 'node:6.10' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}
