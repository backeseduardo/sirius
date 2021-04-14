pipeline {
  agent {
    docker {
      image 'node:14-alpine'
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
