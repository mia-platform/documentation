---
id: mia-platform-console-faqs
title: Mia-Platform Console FAQs
sidebar_label: Console FAQs
---

### General Concepts & Project Management

#### What is the Mia-Platform Console?
The Mia-Platform Console is a cloud-native Platform Builder that functions as an **Internal Developer Platform (IDP)**. It's designed to help organizations industrialize and govern the entire software development lifecycle. By providing a centralized **developer hub**, it simplifies cloud-native complexity, empowers development teams with self-service capabilities, and allows **platform engineers** to enforce governance and **platform engineering best practices**. The Mia-Platform Console manages everything from infrastructure connection to API design, deployment, and monitoring.
[Discover more](/products/console/overview-dev-suite.md)

#### What is a "Company" in the Mia-Platform Console?
A **Company** is the highest-level organizational unit in the Mia-Platform Console. It acts as a container for multiple **Projects** and provides centralized governance. At the Company level, you configure shared resources that are inherited by all its projects, such as Kubernetes cluster connections, **Providers** (like Git providers and secret managers), and default project templates. This structure allows an organization to manage different business units or teams in an isolated and organized manner.
[Discover more](/products/console/company-configuration/create-company.md)

#### What is the difference between a Project and an Environment?
* A **Project** is where you build your services. It contains all the necessary configurations, including microservices, APIs, data models (CRUDs), and public variables. Each Project belongs to a Company.
* An **Environment** represents a specific deployment stage within a Project, such as `Development`, `Staging`, or `Production`. Each environment is mapped to a unique namespace in a Kubernetes cluster, allowing you to deploy and test your services in isolated runtime contexts.
  [Discover more](/products/console/project-configuration/application-project.md)

#### What is a "Project Blueprint" and why is it important?
A **Project Blueprint** is a pre-configured Git repository that serves as a starting point for creating new Projects. It includes a default structure, sample configurations, and often pre-defined **CI/CD** pipelines. Using templates is a core aspect of **platform engineering best practices** because it enforces standardization, ensures consistency across projects, and dramatically speeds up the onboarding of new applications by providing developers with a "golden path".
[Discover more](/products/console/company-configuration/project-blueprint.md)

#### How do I create a new Project?
To create a new Project, you must first have a Company, a Git Provider, a CI/CD Provider, a Secret Management Provider and a Project Template configured. From the Console homepage, click "Create Project" and follow the three-step wizard:
1.  **General**: Provide a name, description, and choose the project workflow (Standard or Enhanced).
2.  **Repository**: Select a Git Provider, define the repository path, set visibility, and choose a starting template.
3.  **Environments**: Review the environments that will be automatically configured based on the Company's defaults.
    [Discover more](/products/console/project-configuration/create-a-project.mdx)

#### What is the Enhanced Project Workflow and why should I use it?
The Enhanced Project Workflow is a significant evolution from the standard, Git-centric model. It improves the developer experience by managing the project's logical state directly within the Console, rather than relying on Git for every change. This results in much faster performance in the Design area. Kubernetes configurations are generated only at deploy time, which also enables a pull-based, **GitOps** deployment strategy. It is the recommended workflow for all new projects.
[Discover more](/products/console/set-up-infrastructure/overview.md)

#### What is the difference between a branch and a revision in the Console?
* In the **Standard Workflow**, the Console uses **branches** that directly correspond to Git branches in your configuration repository. All configuration changes are saved via commits to these branches.
* In the **Enhanced Project Workflow**, the concept of branches is replaced by **Revisions**. A Revision is a line of development managed within the Console, consisting of a series of immutable snapshots. This approach decouples the design process from Git, which is only used to store the final orchestrator files upon deployment.
  [Discover more](/products/console/set-up-infrastructure/revisions-and-versions.md)

#### How do I save my configuration changes in the Design area?
In the top-right corner of the Design area, click on the branch/revision name to open the management popover. If you have unsaved changes, a "Save configuration" button will be active. Clicking it opens a modal where you must provide a commit title and an optional message. This action creates a new commit (in Standard Workflow) or a new snapshot (in Enhanced Workflow). if there are remote changes and you want to make your changes too, a warning shows up when opening the action popover, telling the users that they have current local changes but there are also remote changes that should be addressed
[Discover more](/products/console/api-console/api-design/overview.md)

#### How can I merge configurations between two branches or revisions?
From the branch/revision management popover in the Design area, you can select "Merge from another branch". This will open a diff editor where you can compare the configurations of the source and target branches/revisions side-by-side. You can review all changes, resolve conflicts by editing the configuration directly, and then confirm the merge. The merged configuration must then be saved.
[Discover more](/products/console/api-console/api-design/merge_collaboration.md)

#### What are Infrastructure Projects?
Infrastructure Projects are a specialized project type designed for Operations teams and **platform engineers** to manage infrastructure using **Infrastructure as Code** (IaC) principles. Instead of managing applications, these projects manage infrastructure components like cloud resources (e.g., using **Terraform**) or Kubernetes operators. They support a two-phase deployment process (`plan` and `apply`) to ensure changes are reviewed before execution, providing better control over infrastructure provisioning.
[Discover more](/products/console/project-configuration/infrastructure-project.md)

#### How can I delete a Project?
You can delete a Project from the **Project Settings -> Advanced** tab. Clicking the "Delete Project" button will open a confirmation modal where you must type the project's name to confirm. This action is irreversible and will remove the project from the Console, with options to also delete associated namespaces and archive the Git repository.
[Discover more](/products/console/project-configuration/delete-a-project.md)

---
### Configuration & Design

#### How do I create a new microservice in my project?
You can create a microservice from the **Design -> Microservices** section, typically by starting from a **Template** or an **Example** from the Marketplace.
1.  Click "Create a Microservice" and select "From Marketplace".
2.  Choose a template (e.g., "Node.js Template" for **JavaScript** or "Spring Boot Template" for "Java").
3.  Provide a name, description, and specify the details for the new Git repository that will be created for your service's code.
    After creation, you can configure its Docker image, resources, environment variables, and more.
    [Discover more](/products/console/api-console/api-design/custom_microservice_get_started.md)

#### What is the difference between creating a microservice from a Template vs. a Docker Image?
* **From a Template/Example**: This method is for creating a *new* microservice. The Console creates a new Git repository for you by cloning the template's source code. You get a complete, ready-to-code starting point with best practices for logging, health checks, and **CI/CD** already configured.
* **From a Docker Image**: This method is for integrating an *existing* microservice. You provide the name of a pre-built Docker image. The Console does not create a code repository; it only creates the configuration to deploy that existing image as part of your project.
  [Discover more](/products/console/api-console/api-design/services.md)

#### How do I expose a microservice with a public URL?
To expose a microservice, you need to create an **Endpoint**.
1.  Go to **Design -> Endpoints** and click "Create new endpoint".
2.  Define a **Base Path** (e.g., `/my-api`), which is the public URL path.
3.  Set the **Type** to "Microservice".
4.  Select the microservice you want to expose from the dropdown.
    This configuration instructs the API Gateway to handle **ingressing** traffic from the specified base path to your internal microservice.
    [Discover more](/products/console/api-console/api-design/endpoints.md)

#### What is the difference between Public Variables and Secret Variables?
* **Public Variables** are environment-specific variables managed in the **Design -> Public Variables** section. They are stored in plain text within your Git configuration repository and are suitable for non-sensitive data, like feature flags or public URLs.
* **Secret Variables** are for sensitive data like passwords or API tokens. They are managed in the **Project Overview -> Variables** section and are stored securely in a **secrets manager** (like GitLab CI/CD variables, HashiCorp Vault, or **Azure Key Vault**), not in the Git repository.
  [Discover more](/products/console/project-configuration/manage-environment-variables/index.md)

#### How do I configure Kubernetes probes (Liveness & Readiness) for my microservice?
In the microservice's detail page, under the **Runtime** card, you can configure probes.
* **Readiness Probe**: Tells Kubernetes when your container is ready to start accepting traffic.
* **Liveness Probe**: Tells Kubernetes if your container is still running and healthy. If it fails, Kubernetes will restart the container.
  For each probe, you can specify the path (e.g., `/-/healthz`), port, initial delay, and other parameters.
  [Discover more](/products/console/api-console/api-design/microservice-runtime-resources.md)

#### What is a CronJob in the Console and how do I create one?
A **CronJob** is a Kubernetes resource that runs a job on a repeating schedule (e.g., for nightly data processing or cleanup tasks). You can create one from the **Design -> CronJobs** section. You need to provide a name, a Docker image to run, and a schedule in standard cron format (e.g., `0 2 * * *` for 2 AM daily).
[Discover more](/products/console/api-console/api-design/jobs-cronjob.md)

#### What is a CRUD and how do I create one?
A CRUD is a data collection stored in MongoDB that is automatically exposed via a full set of RESTful APIs for Create, Read, Update, and Delete operations. This allows you to quickly bootstrap a data-driven service without writing any backend code. You can create one from the **Design -> MongoDB CRUD** section by providing a name for the collection and then defining its data schema (fields, types, and validation rules).
[Discover more](/products/console/api-console/api-design/crud_advanced.md)

#### How do I manage ConfigMaps for a microservice?
In the microservice's detail page, go to the **ConfigMaps & Secrets** tab. Here you can create a new ConfigMap or mount an existing one. You define a **Runtime Mount Path** (where the files will be available inside the container) and then add files to the ConfigMap. This is useful for managing configuration files that are separate from your application code.
[Discover more](/products/console/api-console/api-design/services.md)

#### Can I use Kustomize for environment-specific configurations?
Yes, Kustomize is fully supported. When you enable it for a project, an `overlays` directory is created in your configuration repository. Inside this directory, you can create a folder for each environment (e.g., `production`) containing patch files and a `kustomization.yaml`. These patches are applied over the base configuration at deployment time, allowing you to declaratively modify resources for specific environments.
[Discover more](/products/console/project-configuration/kustomize-your-configurations/index.md)

---
### Deployment & Runtime

#### How do I deploy my project's configuration?
You deploy from the **Deploy** section.
1.  Select the target environment.
2.  Select the branch, tag, or version to deploy.
3.  Review the comparison of what's currently running versus the new configuration.
4.  Choose between **Smart Deploy** (only deploys changed services) or **Deploy All**.
5.  Clicking "Deploy" triggers the configured **CI/CD** pipeline to apply the changes to the cluster.
    [Discover more](/products/console/deploy/overview.md)

#### How does "Smart Deploy" work?
**Smart Deploy** optimizes the deployment process by only redeploying services whose configurations have actually changed since the last deployment. The Console calculates a checksum of a service's configuration (including its Docker image, environment variables, mounted ConfigMaps, etc.). If the checksum in the new release is different from the one currently running in the environment, the service is marked for deployment. This saves time and resources, especially in large projects.
[Discover more](/products/console/deploy/overview.md)

#### What happens if a deployment fails and how can I check the history?
If a deployment pipeline fails, the Console will show a "Failed" status in the **Deploy** section. The **History** tab in this section provides a log of all past deployments for each environment. You can see the status (Success, Failed, Pending), who triggered it, when it happened, and a direct link to the pipeline logs in your **CI/CD tool** to investigate the cause of the failure.
[Discover more](/products/console/deploy/overview.md)

#### How can I monitor the status of my deployed services?
The **Runtime** section provides a live view of your Kubernetes resources. You can:
* View the status of all **Pods** (running, pending, crashed).
* Inspect individual pods to see CPU/memory usage, event history, and real-time logs.
* Monitor other resources like **Deployments**, **Services**, and **CronJobs**.
  [Discover more](/products/console/monitoring/introduction.md)

#### How can I restart a single pod from the Console?
Yes. Go to the **Runtime** section, find the pod you want to restart in the Pods list. On the right side of the pod's row, there is an options menu (three dots). Clicking it will reveal a "Restart" option. This will safely terminate the existing pod, and Kubernetes will automatically create a new one to replace it. This is useful for recovering a pod that is in a bad state.
[Discover more](/products/console/monitoring/resources/pods.md)

#### How can I view the logs of a running microservice?
Go to the **Runtime** section, select the environment, and find the pod for your microservice. Clicking on the pod name takes you to its detail view. The **Logs** tab shows a real-time stream of the container's logs. You can pause the stream, search for keywords, and download the logs.
[Discover more](/products/console/monitoring/resources/pods.md)

#### How can I debug a service locally while it's connected to the remote cluster?
The Console integrates with **Telepresence**. From the **Debug** section, you can get a command that intercepts traffic from the remote cluster and redirects it to the service instance running on your local machine. This allows you to use local debuggers and see code changes instantly without a full deployment cycle, which is a massive productivity boost.
[Discover more](/products/console/debugging/telepresence.md)

#### What is the API Portal?
The API Portal, accessible from the **Documentation** section, automatically generates and displays interactive API documentation (using OpenAPI/Swagger) for all your exposed endpoints. Developers can use it to explore APIs, understand their schemas, and test them live by making API calls directly from the browser, which greatly accelerates integration tasks.
[Discover more](/products/console/project-configuration/documentation-portal.md)

---
### Security & Access Management

#### How does Role-Based Access Control (RBAC) work in the Console?
The Console uses a hierarchical RBAC model. Permissions are grouped into **Roles** (e.g., `Developer`, `Maintainer`), and roles are assigned to users or groups at different levels (Console, Company, or Project). Permissions are inherited downwards, so a `Company Owner` has full admin rights over all projects within that company. This allows for both broad and granular control over who can do what.
[Discover more](/products/console/identity-and-access-management/console-levels-and-permission-management.md)

#### What is the difference between a `Developer` and a `Maintainer` role?
The key difference is deployment rights.
* A **`Developer`** can edit the project configuration in the Design area (create services, endpoints, etc.) and save their changes. They can view runtime environments but cannot deploy to them.
* A **`Maintainer`** has all the permissions of a Developer, plus the ability to trigger deployments to runtime environments. This role is typically assigned to team leads or senior developers responsible for releases.
  [Discover more](/products/console/identity-and-access-management/console-levels-and-permission-management.md)

#### How do I add a new user to my Company or Project?
A `Company Owner` can add users at the Company level from the **IAM -> Users** section by inviting them via email and assigning a role. A `Project Administrator` can manage roles for existing company users at the Project level. You can assign roles directly to individual users or, for easier management, add users to a **Group** that has the desired role.
[Discover more](/products/console/identity-and-access-management/manage-users.md)

#### How do I create a Service Account and what is it used for?
A `Company Owner` can create a **Service Account** from the **IAM -> Service Accounts** section. A Service Account is a non-human identity used for automation, primarily in **CI/CD** pipelines. Instead of a username/password, it uses client credentials or a private key JWT for authentication. You assign it a role just like a regular user to grant it the specific permissions it needs to perform its tasks, such as triggering a deployment.
[Discover more](/products/console/identity-and-access-management/manage-service-accounts.md)

#### How do Groups simplify user management?
Groups allow you to manage permissions for multiple users at once. Instead of assigning the `Developer` role to 20 individual users, you can create a "Developers" group, assign the `Developer` role to the group, and then add the 20 users to that group. All members of the group inherit the role's permissions. This is much more efficient and less error-prone, especially for large teams.
[Discover more](/products/console/identity-and-access-management/manage-groups.md)

#### How do I protect an endpoint?
You can secure an endpoint from its configuration page in the **Design -> Endpoints** section. The **Security** tab offers several options:
* **Authentication required**: If checked, the user must be logged in.
* **API Key required**: If checked, a valid API Key must be sent in the `client-key` or `secret` header.
* **User Group Permission**: An expression-based rule for fine-grained control. You can write logic based on the user's groups (e.g., `groups.admin`) or the API key's client type (e.g., `clientType == 'my-app'`).
  [Discover more](/products/console/api-console/api-design/endpoints.md)

#### How does the authorization flow work for a protected endpoint?
1.  A client sends a request with credentials to the **API Gateway**.
2.  The API Gateway forwards the request headers to the **Authorization Service**.
3.  The Authorization Service calls an **Authentication Manager** (like the `auth0-client`) to validate the credentials and get user information (ID, groups, etc.).
4.  The Authorization Service evaluates the endpoint's **User Group Permission** expression against the user's info.
5.  If authorized, it returns success to the API Gateway, which then forwards the request to the target microservice, adding headers like `miauserid` and `miausergroups`.
    [Discover more](/products/console/project-configuration/auth-flow/authorization-flow)

#### How can I implement more advanced authorization with policies?
For advanced authorization, you can enable **Rönd**, an open-source sidecar based on Open Policy Agent (OPA). With Rönd, you can write declarative policies in the **Rego** language to enforce complex rules, such as:
* **Row Filtering**: Filtering data from a CRUD response based on user attributes (e.g., a user can only see their own orders).
* **Response Filtering**: Removing specific fields from a response body (e.g., hiding a `salary` field from non-admin users).
* **Attribute-Based Access Control (ABAC)** on the request itself.
  [Discover more](/products/console/api-console/api-design/authorization.md)

---
### Advanced Features & Extensibility

#### How can I extend the Console with custom functionality?
The Console's **Extensibility** feature allows you to add custom pages to the sidebar navigation by embedding external web applications as an `<iframe>`. This is useful for integrating third-party tools, custom dashboards, or administrative UIs directly into the Console, creating a unified **developer portal**.
[Discover more](/products/console/company-configuration/extensions.md)

#### How does Single Sign-On (SSO) work for Console Extensions?
Your extension can integrate with the **Console SSO** via an OAuth 2.0 flow. When a user accesses your extension, it can initiate a login that redirects to the Console. Since the user is already logged in, they are transparently redirected back to your extension with an authorization code. Your extension's backend can then exchange this code for an access token to securely identify the user and their permissions.
[Discover more](/products/console/tutorials/create-extension-with-sso.md)

#### What are Providers and how do they make the Console flexible?
Providers are the mechanism for integrating the Console with external **devops tools**. They abstract the connection details, allowing you to easily switch between different services. The Console supports:
1.  **Git Providers**: For source code (e.g., GitLab, GitHub).
2.  **Secret Managers**: For sensitive data (e.g., HashiCorp Vault, **Azure Key Vault**).
3.  **CI/CD Tools**: For running deployment pipelines (e.g., GitLab CI, Jenkins).
    [Discover more](/products/console/company-configuration/providers/overview.md)

#### Can I use my own CI/CD tool, like Jenkins, with the Console?
Yes. You can configure a **Jenkins** instance as a **CI/CD Tool Provider** at the Company level. When you do this, you'll provide the Console with the URL and credentials for your Jenkins server. When a user triggers a deployment from the Console, it will make an API call to Jenkins to start the appropriate job, passing parameters like the revision to be deployed and the target environment.
[Discover more](/products/console/deploy/pipeline-based/configure-jenkins.md)

#### How does the Console support different cloud providers like AWS, GCP, and Azure?
Mia-Platform Console is cloud-agnostic. It interacts with any CNCF-compliant Kubernetes cluster, regardless of the underlying provider (**aws cloud computing**, **google cloud run**, etc.). You can connect clusters from GKE, EKS, or AKS. For other integrations, it supports specific providers like **aws secrets manager** or **azure key vault**. Features like **Infrastructure Projects** can manage cloud-specific resources like **aws s3** buckets or **aws fargate** services using **Terraform**.
[Discover more](/products/console/company-configuration/clusters-management/overview.md)

#### What are Webhooks and how can I use them?
Webhooks allow you to subscribe to events within the Console, such as "Project Created". When an event is triggered, the Console sends an HTTP POST request with a payload to a URL you configure. This is useful for building custom integrations, like sending a notification to a Slack channel or triggering an external workflow.
[Discover more](/products/console/company-configuration/webhooks.md)

#### How does versioning work for Mia-Platform releases?
Mia-Platform follows semantic versioning with a `MAJOR.MINOR.PATCH` format:
* **MAJOR** (e.g., v14.0.0): Increased for significant new functionality or backward-incompatible changes.
* **MINOR** (e.g., v14.1.0): Increased for new features and functional improvements.
* **PATCH** (e.g., v14.1.1): Increased for bug fixes, stability, performance or small improvements.
  The documentation also specifies which features are in `Beta` or `Preview`.
  [Discover more](/release-notes/info/version_policy)

#### What is Mia-Platform's bug fixing policy?
Bugs are assessed based on symptom severity, with three levels:
* **Severity 1 (Critical)**: The application is unavailable (e.g., login failure for all users, significant data loss).
* **Severity 2 (Major)**: A key feature is unavailable, or performance is significantly degraded.
* **Severity 3 (Minor)**: An issue with a viable workaround, or a cosmetic defect.
  Fixes are delivered in patch releases, and customers need to upgrade to a release containing the fix to receive it.
  [Discover more](/release-notes/info/bug_policy)

