node('nodejs') {
    def app = "appName"
    def project = "APPCODE-d"
    def configuration = "develop"
    def url = "ssh://bitbucket@***********/***/appName.git"

    stage('Git') {
        git branch: 'develop', url: "${url}", credentialsId: 'SAPPCODE-AUTOMATION'
    }

    stage('Build') {
        withEnv([
            'NPM_CONFIG_USERCONFIG=/build-config/.npmrc'
        ]) {
            sh "npm install -g @angular/cli@7.1.3"
            sh "npm install --sass_binary_path=/build-config/node-sass/releases/v4.9.3/linux-x64-57_binding.node"
            sh "mkdir -p node_modules/node-sass/vendor/linux-x64-57/"
            sh "cp /build-config/node-sass/releases/v4.9.3/linux-x64-57_binding.node node_modules/node-sass/vendor/linux-x64-57/binding.node"
            sh "./node_modules/.bin/compodoc -p tsconfig.json -a screenshots -d ./dist/***/doc --hideGenerator --theme Postmark"
        }
    }

    stage ('Image') {
        sh "rm -rf oc-build"
        sh "mkdir oc-build"
        sh "cp -r documentation/* oc-build"
        openshift.withCluster() {
            openshift.withProject("${project}") {
                def bc = openshift.selector("bc", "${app}")
                if(!bc.exists()){
                    openshift.newBuild("--name=${app}",
                            "--image-stream=openshift/httpd:latest",
                            "--binary=true",
                            "--labels=app=${app}")
                    echo "${bc.names()} created"
                }
                echo "${bc.names()} starting"
                bc.startBuild("--from-dir=oc-build","--wait=true")
                echo "${bc.names()} finished"

                def dc = openshift.selector("dc", "${app}")
                if(!dc.exists()){
                    openshift.newApp("${app}:latest")
                    openshift.set("probe",
                            "dc/${app}",
                            "--readiness",
                            "--get-url=http://:8080")
                    openshift.set("probe",
                            "dc/${app}",
                            "--liveness",
                            "--get-url=http://:8080")
                }
                def route = openshift.selector( "routes", "${app}")
                if(!route.exists()){
                    openshift.raw("create",
                            "route",
                            "edge",
                            "${app}",
                            "--service=${app}",
                            "--hostname=${app}-${project}.**********",
                            "--port=8080",
                            "--cert=/build-config/cert/${app}/${app}-${project}.**********.pem",
                            "--key=/build-config/cert/${app}/${app}-${project}.**********.key")
                }
            }
        }
    }

    stage ('Check') {
        retry(15){
            sleep 15
            sh "curl --insecure -m 10 -sL -I https://${app}-${project}.********** | grep -c '200'"
        }
    }
}