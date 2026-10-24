// Runner requires Node.js 22.23.4+ and Bun 1.4.3+. Portable validation pipeline. Configure deployment separately for the chosen host.
pipeline {
    agent any
    options { disableConcurrentBuilds() }
    stages {
        stage('Install') {
            steps { sh 'bun install --frozen-lockfile' }
        }
        stage('Verify') {
            steps { sh 'bun run verify' }
        }
    }
    post {
        success { archiveArtifacts artifacts: 'dist/**', fingerprint: true }
    }
}
