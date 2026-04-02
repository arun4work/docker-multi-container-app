# 🚀 Multi-Container Full Stack App

A production-ready, containerized 3-tier architecture featuring a React frontend, Node-Express backend, and a Node.JS background worker. This setup utilizes **Nginx** as a reverse proxy for production deployment and is fully automated via **GitHub Actions**.

---

## 🏗️ Architecture Overview

The system is split into four primary containers to ensure separation of concerns:

| Service    | Technology   | Internal Port | Description                                                              |
| :--------- | :----------- | :------------ | :----------------------------------------------------------------------- |
| **Proxy**  | Nginx        | 80            | The single entry point. Routes traffic to UI or API(Only for Production) |
| **UI**     | React (Vite) | 3000          | Frontend application served via Vite in local but Nginx in production.   |
| **API**    | Node/Express | 5001          | Core backend handling logic and database queries.                        |
| **Worker** | Node.js      | N/A           | Background process for Redis/Postgres tasks.                             |

---

## 🛠️ Section 1: Local Development Workflow

_Goal: Fast iteration with Hot Module Replacement (HMR) and easy debugging._

1.  **Environment Setup**:
    - Locate the [.env.example](https://github.com/arun4work/docker-multi-container-app/blob/master/.env.example) in the root.
    - Rename it to `.env` on your local machine and provide the necessary values for your local database and Redis instances.
2.  **Service Configuration**:
    - Each service has its own dedicated Dockerfile.dev for development.
    - **View Dockerfiles:** [Client](https://github.com/arun4work/docker-multi-container-app/blob/master/client/Dockerfile.dev), [Server](https://github.com/arun4work/docker-multi-container-app/blob/master/server/Dockerfile.dev), [Worker](https://github.com/arun4work/docker-multi-container-app/blob/master/worker/Dockerfile.dev).
3.  **Spinning Up the App**:
    - Run the standard compose command:
      ```bash
      docker compose up --build
      ```
    - This uses the default [docker-compose.yaml](https://github.com/arun4work/docker-multi-container-app/blob/master/docker-compose.yaml) which mounts your code as volumes for instant updates.
4.  **Access Points:**
    - **Frontend:** `http://localhost:3000` (Direct Vite access)
    - **Backend:** `http://localhost:5001` (Direct Node access)

---

## 🚀 Section 2: Production & Deployment Workflow

_Goal: Hardened security, Nginx proxying, and automated CI/CD to Docker Hub._

1.  **Nginx Proxy Setup**:
    - In production, all traffic flows through Port 80 via Nginx.
    - **View Proxy Config:** [nginx/default.conf](https://github.com/arun4work/docker-multi-container-app/blob/master/nginx/default.conf) and [nginx/Dockerfile](https://github.com/arun4work/docker-multi-container-app/blob/master/nginx/Dockerfile).
2.  **GitHub Secrets Configuration**:
    - To enable the automated pipeline, you must add your credentials to the repository settings.
    - **Action:** Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` here: [GitHub Action Secrets Settings](https://github.com/arun4work/docker-multi-container-app/settings/secrets/actions).
3.  **Automated CI/CD Pipeline**:
    - The workflow triggers on every merge to `master`. It handles testing, building production-ready images, and pushing them to Docker Hub.
    - **View Workflow:** [.github/workflows/deploy.yaml](https://github.com/arun4work/docker-multi-container-app/blob/master/.github/workflows/deploy.yaml).
4.  **Production Orchestration**:
    - We use a specialized [docker-compose-prod.yaml](https://github.com/arun4work/docker-multi-container-app/blob/master/docker-compose-prod.yaml) that uses variable interpolation (e.g., `${DOCKERHUB_USERNAME}`) to avoid hardcoding.
5.  **Local Production Testing**:
    - To verify the full production stack (including the Proxy) on your Mac:
      ```bash
      docker compose -f docker-compose-prod.yaml up --build
      ```

---

## 🤖 CI/CD Pipeline (GitHub Actions)

The pipeline is fully automated and triggers on every merge to the `master` branch.

### 1. Test & Verify

- **Environment:** Node.js 24.x.
- **Tasks:**
  - Dependency installation in `./client`, `./server`, and `./worker`.
  - Type checking via `npx tsc --noEmit` to ensure code integrity.
  - Unit tests via `npm run test:run -- --reporter=github-actions`.
  - Production build smoke test.

### 2. Build & Push (Docker Hub)

- **Credentials:** Uses `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (PAT) from GitHub Secrets.
- **Variable Interpolation:** Images are tagged using `${DOCKERHUB_USERNAME}/repo-name:latest` as defined in the production compose file.
- **Artifacts:** Pushes `ui`, `server`, `worker`, and `proxy` images to Docker Hub for deployment.

### 3. Automated Cloud Sync

- **Render:** Sends a `POST` request to specific **Deploy Hooks** to trigger an immediate pull of the new images.
- **Vercel:** Automatically detects the merge and redeploys the frontend from the `./client` directory.

---

## ☁️ Deployment Strategies

### Strategy 1: Unified Cluster (e.g., Koyeb, AWS, OCI)

_Best for managing everything under a single provider using the Nginx Reverse Proxy._

1.  **Registry Secret:** Create a secret (e.g., `docker-hub-creds`) in your provider using your Docker Hub PAT.
2.  **Infrastructure:**
    - **Database:** [Neon](https://neon.tech) (Postgres 17).
    - **Redis:** [Upstash](https://upstash.com).
3.  **Service Setup:** Create a **Web Service** pointing to your `proxy` image. The Proxy handles routing:
    - `/` → UI Container
    - `/api` → Server Container

### Strategy 2: Distributed Cloud (Vercel + Render + Neon)

_Best for high-performance frontend delivery and zero-cost background processing._

1.  **Frontend (Vercel):**
    - Connect the GitHub repo and point the "Root Directory" to `./client`.
    - Configure `VITE_API_BASE_URL` to point to your Render API URL.
2.  **Backend & Worker (Render):**
    - **API:** Deploy as a **Web Service** using the `server` Docker image.
    - **Worker:** Deploy as a **Web Service** using the `worker` Docker image.
    - **Note:** The Worker includes an HTTP heartbeat server on port `10000` to satisfy Render’s port-check on the Free Tier.
3.  **Security:** All database connections are configured with `sslmode=require` to satisfy Neon's security requirements.

> **💡 Staff Pro-Tip:** When using **Strategy 2**, ensure `NODE_ENV=production` is set in the Render dashboard. This ensures the application correctly toggles **SSL for Postgres** and optimizes the Node.js runtime.

---

## 📝 Common Troubleshooting

| Error                      | Root Cause                             | Fix                                                                 |
| :------------------------- | :------------------------------------- | :------------------------------------------------------------------ |
| `ERR_CONNECTION_REFUSED`   | UI is hitting port 5001 instead of 80. | Update `VITE_API_BASE_URL` to `http://localhost`.                   |
| `invalid parameter "3000"` | Nginx syntax error in `default.conf`.  | Remove space: `server ui:3000;` (not `ui: 3000`).                   |
| `denied: requested access` | Docker Hub push failed due to naming.  | Ensure `DOCKERHUB_USERNAME` is passed in the Action's `env` block.  |
| `No such image: client`    | Compose naming mismatch.               | Use `image:` key in `docker-compose-prod.yaml` for explicit naming. |

---

## 🔗 Quick Link Reference

| Resource               | GitHub Location                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Root Repository**    | [arun4work/docker-multi-container-app](https://github.com/arun4work/docker-multi-container-app)                                    |
| **Production Compose** | [docker-compose-prod.yaml](https://github.com/arun4work/docker-multi-container-app/blob/master/docker-compose-prod.yaml)           |
| **Deployment Script**  | [.github/workflows/deploy.yaml](https://github.com/arun4work/docker-multi-container-app/blob/master/.github/workflows/deploy.yaml) |
| **Nginx Folder**       | [nginx/](https://github.com/arun4work/docker-multi-container-app/tree/master/nginx)                                                |

---
