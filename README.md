# OilerRig WebApp

## Overview

OilerRig WebApp is a **React** single-page application (SPA) that serves as the frontend for the OilerRig system. It provides a user-friendly interface for customers to browse products and place orders, with secure authentication and an admin panel for management tasks. The app interacts with a **Spring Boot** backend API for data and business logic, using JSON REST endpoints. Key features include:

* **Auth0 Authentication** – Users can log in and out via Auth0’s Universal Login. The app obtains JWT access tokens from Auth0 for calling protected backend APIs.
* **Protected Admin Interface** – An admin section (accessible only to authorized users) allows management of orders and other administrative functions.
* **Order Management and Checkout** – Customers can view products, add items to a cart, and complete purchases. Order data is sent to the Spring Boot backend for processing. Admins can view all orders in the admin panel.
* **Responsive SPA Frontend** – The UI is built as a fast, responsive SPA using React and Tailwind CSS. No full page reloads are needed, and the design adapts to different screen sizes.

## Tech Stack & Dependencies

The frontend is built with a modern JavaScript stack and several libraries:

* **React 19.x** – Core library for building the user interface (functional components, hooks).
* **Vite** – Development server and build tool for fast bundling and Hot Module Replacement during development.
* **TypeScript** – Used throughout the project for type-safe JavaScript development.
* **Tailwind CSS** – Utility-first CSS framework for styling the application, for quick and responsive UI design.
* **Auth0 React SDK (`@auth0/auth0-react`)** – Provides React hooks and components to integrate Auth0 authentication (login, token management) into the app.
* **SweetAlert2** (with `sweetalert2-react-content`) – Used for elegant modal popups (e.g. displaying alerts and confirmation dialogs to the user).
* **Lucide-React** – Icon library (React components for icons) used for UI icons (e.g. shopping cart, etc.).

*(Additional tools include ESLint for linting, and other dev dependencies configured via Vite. The app’s base scaffolding comes from the Vite React template.)*

## Development Setup

Follow these steps to set up a local development environment for the frontend:

1. **Prerequisites:** Ensure you have **Node.js** (version 18+ recommended, e.g. Node 20) and **npm** installed on your system. You will also need access to the backend API (either running the Spring Boot server locally or accessible via network) for full functionality.

2. **Clone the Repository:** Clone the OilerRig/WebApp repository to your local machine and navigate into the project directory. For example:

   ```bash
   git clone <repository-url>.git  
   cd WebApp
   ```

3. **Install Dependencies:** In the project directory, install the npm dependencies:

   ```bash
   npm install
   ```

4. **Configure Environment Variables:** The app requires certain environment variables to run, specifically the Auth0 credentials. Create a file named **`.env`** in the project root (this file is git-ignored) and add the following variables:

   ```env
   VITE_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com  
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id  
   ```

   * **VITE\_AUTH0\_DOMAIN** should be your Auth0 tenant domain (e.g. `dev-1234abcd.us.auth0.com`).
   * **VITE\_AUTH0\_CLIENT\_ID** is the Client ID of the Auth0 application for this frontend.
     *(These will be used by the app at build/runtime via Vite’s environment variables.)*

   If you plan to use a different backend URL or Auth0 API audience than the default, you may also need to adjust the code or add an env variable for that. By default, in development the app is configured to proxy API calls to `/api` (see **vite.config.js**) which forwards to the backend. Ensure the backend is running and accessible for API requests.

5. **Run the App Locally:** Start the development server:

   ```bash
   npm run dev
   ```

   This will launch the Vite dev server (by default on **[http://localhost:5173](http://localhost:5173)**). You should see output in the terminal indicating the local address. Open the URL in your web browser to use the app. The app will automatically reload on code changes thanks to Vite's HMR.

6. **Trust Self-Signed Certificates (if applicable):** If your Spring Boot backend is running with a self-signed SSL certificate (for example, in a local or staging environment), the browser will normally block the frontend’s API requests due to untrusted cert. To fix this, you need to manually trust the certificate: open the backend’s test endpoint in a browser and accept the security warning. For instance, if your backend is running at `https://oilerrig.westeurope.cloudapp.azure.com`, navigate to **[`https://oilerrig.westeurope.cloudapp.azure.com/test`](https://oilerrig.westeurope.cloudapp.azure.com/test)** and proceed past the certificate warning. Once accepted, your browser will trust that certificate, and the React app’s API calls to the backend will succeed. *(This step is only needed for self-signed certificates in development or test environments.)*

## Production Deployment

The project is set up for continuous deployment using **Azure Static Web Apps** via GitHub Actions. The frontend will be built and deployed to Azure’s static web app hosting, and it will communicate with the production Spring Boot backend. Below are the steps and requirements to configure the production deployment pipeline and environment:

* **Azure Static Web App Setup:** First, create an Azure Static Web Apps resource in your Azure account (if not already created). This service will host the built frontend. When you create a Static Web App, Azure generates a deployment token and a default GitHub Actions workflow file (already present in `.github/workflows/`). In this project, a workflow file (e.g. **`azure-static-web-apps-YOUR_APP_NAME.yml`**) is included to handle the build and deployment.

* **GitHub Actions – Deployment Token:** For the GitHub Actions workflow to deploy the app, you need to provide the Azure Static Web App deployment token as a secret in your GitHub repository. In GitHub, go to **Settings > Secrets and variables > Actions** and add a new **Repository Secret**. Name the secret exactly as expected by the workflow. For example, if the workflow file references `AZURE_STATIC_WEB_APPS_API_TOKEN_<YOUR_APP_ID>` (a token name containing your static app name or ID), use that as the secret name. Set the secret value to the deployment token obtained from the Azure Static Web App (in the Azure portal, find your Static Web App resource’s **Deployment Token** under **Settings**). This secret allows the GitHub Action to authenticate and upload the build to Azure.
  *Example:* If the workflow file contains a line:

  ```yaml
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_WAVE_00B3C0B03 }}
  ```

  then you must add a repository secret named **`AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_WAVE_00B3C0B03`** (with the value set to your token). If you prefer a simpler name, you can also edit the workflow file to use a secret like `AZURE_STATIC_WEB_APPS_API_TOKEN`, and add that secret in GitHub.

* **Production Build Configuration:** Just like in development, the production build needs the Auth0 configuration. In a CI/CD pipeline, you shouldn’t commit sensitive values to the repo. Instead, provide the Auth0 domain and client ID to the build process via environment variables or secrets:

  * One approach is to add **Auth0 credentials as secrets** in GitHub (e.g. `PROD_AUTH0_DOMAIN`, `PROD_AUTH0_CLIENT_ID`) and then update the workflow YAML to pass these as environment variables to the build step. For example, under the build job, you can add:

    ```yaml
    env:
      VITE_AUTH0_DOMAIN: ${{ secrets.PROD_AUTH0_DOMAIN }}
      VITE_AUTH0_CLIENT_ID: ${{ secrets.PROD_AUTH0_CLIENT_ID }}
    ```

    This will ensure that when `npm run build` runs on the GitHub runner, it uses your production Auth0 settings. Alternatively, you can configure these variables in the Azure Static Web App itself (in the portal under Configuration), but setting them in the build step is straightforward for front-end only variables.
  * Make sure the values correspond to your production Auth0 application (they might be the same as dev, or you might have a separate Auth0 app for production).

* **Deploying:** With the above secrets in place, the **GitHub Actions workflow** will handle deployment. On every push to the `main` branch (or when manually triggered if configured), the action will:

  1. Check out the repository code.
  2. Install dependencies and build the app (`npm run build`), producing a production-ready static site in the `dist/` folder.
  3. Deploy the `dist` folder to Azure Static Web Apps using the provided token.
     You can monitor the progress of deployments in the **Actions** tab of your repository. After a successful deployment, your front-end will be accessible via the URL of your Azure Static Web App (for example, `https://<your-app-name>.azurestaticapps.net` or a custom domain if configured).

* **CORS Configuration on Backend:** In production, the frontend is served from a different domain (the Azure Static Web Apps domain or your custom domain) than the backend API. You **must configure CORS (Cross-Origin Resource Sharing)** on the Spring Boot backend to allow the frontend’s origin, otherwise API calls from the deployed frontend will be blocked by the browser. Update your Spring Boot application’s CORS settings to include the static app’s domain in its allowed origins. This can usually be done via a global CORS configuration or annotations (e.g., using `@CrossOrigin` on controllers or a WebMvcConfigurer). For example, if your static app is hosted at `https://your-webapp.azurestaticapps.net`, ensure that is allowed in the backend CORS config. **Without proper CORS setup, the front-end will not be able to consume the backend APIs.** Once CORS is configured, the production front-end should communicate with the backend successfully using the Auth0-issued JWT tokens for authorization.

## Additional Notes

* **Admin Access:** By design, certain routes or components (like the Admin Orders page) are intended for administrative users. Ensure that your Auth0 configuration issues the appropriate user roles or permissions in the ID/Access token, and that the backend also enforces admin privileges on protected endpoints. The front-end may conditionally render admin links (for example, the navigation may show an “Admin” section) based on the user’s profile/claims from Auth0.

* **SSL in Development:** If you run the Spring Boot backend locally, you can either configure it for HTTP (to avoid cert issues) or use HTTPS with a self-signed cert. If using HTTP for local development, update the proxy target in `vite.config.js` and Auth0 audience accordingly (e.g., `http://localhost:8080`). For HTTPS with self-signed, remember to trust the cert as noted above. The Auth0 **Allowed Callback URLs** and **Allowed Logout URLs** should also match your local setup (e.g., `http://localhost:5173`).

* **Tailwind JIT:** The project uses Tailwind CSS via the Vite plugin. During development, Tailwind’s JIT mode will automatically purge and generate styles based on the content in your React components. If you add new component files or change the paths, ensure Tailwind is processing them (by default, the plugin looks at your `.html`, `.jsx/.tsx` files in the project).

By following this guide, you should be able to run the OilerRig WebApp locally for development and deploy it to a production environment. The README covers the essential configuration and setup steps to get the frontend up and running and integrated with its backend and Auth0. For any further details, refer to the code comments and configuration files in the repository. Good luck and happy coding!
