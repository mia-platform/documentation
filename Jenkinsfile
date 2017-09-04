node {

    def site = "site"
    def docDir = "/baas/docs"

    stage("Checkout doc sources") {
        checkout([$class: "GitSCM", branches: [[name: "*/master"]], userRemoteConfigs: [[credentialsId: "edada490-85cc-4502-825e-d77068fdc488", url: "git@git.makeitapp.eu:makeitapp-baas/mia-platform-doc.git"]]])
    }


    stage("Generate static documentation") {
        sh "mkdocs build"
    }

    stage("Archive docs") {
        sh "tar czf ${site}.tar.gz $site"
    }

    stage("Deploy docs") {
        def pwd = "sjAAsd273782378!!sajhjsa"
        def server = "preprod@23.97.171.78"

        sh "sshpass -p '$pwd' scp -r \"${site}.tar.gz\" $server:$docDir"
        sh "sshpass -p '$pwd' ssh -T $server \"bash -ic 'cd $docDir && tar xvzf ${site}.tar.gz' && mv ${docDir}/${site}/* . && rm -fr ${docDir}/${site}\""
    }

    stage("Clean build"){
        sh "rm -fr ${site}*"
    }

}
