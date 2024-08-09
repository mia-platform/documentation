# FAQ

### How can I configure "subswaggers" in the Swagger-Aggregator for the API portal?

To correctly configure "subswaggers" in the Swagger-Aggregator, ensure that the path expression is set properly. One option is to use `path.startsWith('/doc-gen/')` to include all routes under this path in the desired category. This setup allows you to display the routes in the correct section of the API portal.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/532).


### How do I configure Microsoft OAuth applications for a self-hosted installation?

When setting up OAuth for a self-hosted installation using Microsoft Identity Provider, the Redirect URIs should be configured as follows:

- For the Console: `https://<Console_Host>/oauth/callback`
- For the CMS: `https://<CMS_Host>/web-login/oauth/callback`

These settings ensure that the authentication process redirects users correctly after they log in.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/528).


### How can I solve the "Error: spawnSync ... ENOENT" when running npm commands in my Docker container?

This error typically occurs because the command you are trying to run is not available in the PATH within the Docker container. Ensure that the necessary dependencies are installed and correctly referenced in your Dockerfile or environment. You may need to install additional tools or ensure that the command is properly installed in your environment.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/527).


### How can I resolve "403 Forbidden" errors when using the Mia-Platform Console APIs?

"403 Forbidden" errors when accessing Mia-Platform Console APIs are often related to insufficient permissions. Make sure that your API key or token has the necessary permissions to access the resources you're trying to interact with. You may need to review and adjust the roles and permissions assigned to your credentials.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/526).


### How can I set up a custom domain for my Mia-Platform Console?

To set up a custom domain for your Mia-Platform Console, you'll need to configure your DNS records and update the environment variables related to the Console's domain. Ensure that the DNS is correctly pointed to your environment and that the domain settings are properly applied in your Mia-Platform configuration.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/520).


### How can I configure the CMS to use a different database?

To configure the CMS to use a different database, you need to adjust the environment variables that specify the database connection details. This typically involves setting the correct database type, host, port, username, and password in the CMS configuration. Make sure that these values align with your desired database setup.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/521).


### How can I deploy my Mia-Platform application using GitHub Actions?

To deploy your Mia-Platform application using GitHub Actions, you need to set up a workflow that builds your application and then deploys it to Mia-Platform. This involves configuring your GitHub Actions YAML file to include the necessary steps for building, testing, and deploying your code.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/519).


### How can I troubleshoot connection issues when deploying a microservice to Mia-Platform?

To troubleshoot connection issues when deploying a microservice to Mia-Platform, check the network policies and service bindings in your configuration. Ensure that the microservice is correctly connected to the necessary resources and that there are no firewall or networking issues preventing the connection.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/517).


### How can I resolve issues with custom scripts in my Mia-Platform Console deployment?

To resolve issues with custom scripts in your Mia-Platform Console deployment, ensure that the scripts are correctly referenced and executed within your deployment pipeline. Check for syntax errors, proper permissions, and that all necessary dependencies are installed. Also, verify that the scripts align with the specific environment settings of your deployment.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/516).


### How can I use Mia-Platform's Console to manage environment variables?

To manage environment variables in Mia-Platform's Console, you can navigate to the environment section where you can add, edit, or remove variables as needed. These variables are crucial for configuring your application based on different environments such as development, staging, or production.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/512).


### How can I update environment variables during a deployment in Mia-Platform?

To update environment variables during a deployment in Mia-Platform, you need to ensure that the updated variables are correctly applied in the deployment configuration. This often involves editing the deployment YAML files or updating the environment settings directly in the Console to reflect the new variables.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/484).


### How can I debug failed deployments in Mia-Platform?

To debug failed deployments in Mia-Platform, start by checking the deployment logs for error messages that can provide clues about what went wrong. Common issues include misconfigured environment variables, missing dependencies, or incorrect YAML syntax. Reviewing the logs and deployment configuration can help identify and resolve these issues.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/510).


### How can I configure HTTPS for my Mia-Platform Console?

To configure HTTPS for your Mia-Platform Console, you'll need to set up SSL certificates and configure your environment to use them. This typically involves generating or obtaining an SSL certificate, then updating the Console's configuration to reference the certificate and enable HTTPS.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/506).


### How can I integrate Mia-Platform Console with external authentication providers?

To integrate Mia-Platform Console with external authentication providers, you need to configure the identity provider settings in the Console's environment. This includes setting up the correct client ID, client secret, and redirect URIs that match the settings provided by the external authentication service. Ensure that the integration is properly tested to confirm that users can authenticate successfully.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/503).


### How can I resolve issues with Kubernetes deployments in Mia-Platform?

If you're encountering issues with Kubernetes deployments in Mia-Platform, start by reviewing your deployment configurations and logs. Common problems can include incorrect resource specifications, misconfigured environment variables, or network policy conflicts. Checking these areas can help identify the root cause and resolve the deployment issues.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/502).


### How can I configure a backup strategy for my Mia-Platform applications?

To configure a backup strategy for your Mia-Platform applications, you should set up regular backups of your databases and persistent storage. This often involves scheduling automated backup jobs and ensuring that these backups are stored securely and can be restored quickly in case of failure. It's also important to regularly test your backup and restore process to verify that everything works as expected.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/501).


### How can I handle authentication timeouts in Mia-Platform Console?

Authentication timeouts in Mia-Platform Console can often be addressed by adjusting the session duration settings or refreshing tokens more frequently. Ensure that your authentication configuration allows for the desired session length and that users are properly redirected if a timeout occurs. You may also need to check the connection between the Console and the identity provider.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/495).


### How can I customize the logging level in Mia-Platform microservices?

To customize the logging level in Mia-Platform microservices, you need to adjust the logging configuration within your microservices. This typically involves setting environment variables or updating configuration files to specify the desired logging level (e.g., DEBUG, INFO, WARN, ERROR). Properly configuring the logging level helps in troubleshooting and monitoring your services effectively.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/481).


### How can I monitor the performance of my Mia-Platform microservices?

To monitor the performance of your Mia-Platform microservices, you can integrate monitoring tools that track metrics such as CPU usage, memory consumption, and request latency. Configuring these tools within your environment will help you gain insights into the performance and health of your microservices, enabling you to optimize and troubleshoot issues effectively.

For more details, you can check out the [discussion here](https://github.com/mia-platform/community/discussions/478).

