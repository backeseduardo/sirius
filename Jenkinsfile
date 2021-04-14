pipeline {
  agent {
    node {
      label '14.16.1'
    }

  }
  stages {
    stage('build') {
      steps {
        sh '''npm install yarn
yarn build'''
      }
    }

    stage('test') {
      steps {
        sh 'yarn test'
      }
    }

  }
}