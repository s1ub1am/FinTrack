# Deployment Guide (GitHub Pages + Railway)

Follow these steps to deploy your Finance Tracker.

## 1. Prerequisites (GitHub)
1.  Push your code to a **Public** GitHub Repository (e.g., `finance-tracker`).
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

## 2. Backend (Railway)
1.  Go to [Railway.app](https://railway.app/) and sign up.
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your repository.
4.  **Add Database**:
    - Click **New** -> **Database** -> **MongoDB**.
    - Railway will create a hosted MongoDB for you.
    - Click on the MongoDB card -> **Connect** tab -> Copy the **Mongo Connection URL**.
5.  **Configure Backend Service**:
    - Click on your backend service card (the repo one).
    - Go to **Settings** -> **Root Directory**: `server`
    - Go to **Variables**:
        - `MONGO_URI`: Paste the Mongo Connection URL you copied.
        - `JWT_SECRET`: A secret random string (e.g., `railwaysecret123`).
        - `PORT`: `5000` (Railway provides its own port variable, but this is safe).
6.  Railway will auto-deploy. Wait for the green "Success" check.
7.  **Copy the Domain**: Go to **Settings** -> **Domains** -> Generate Domain. Copy the URL (e.g., `web-production-xxxx.up.railway.app`).

## 3. Frontend (GitHub Pages)
1.  **Update API URL**:
    - Go to `client/src/utils/axiosHelper.js`.
    - Change `baseURL` to your **Railway Backend URL** (e.g., `'https://web-production-xxxx.up.railway.app/api'`).
2.  **Install gh-pages**:
    ```bash
    cd client
    npm install gh-pages --save-dev
    ```
3.  **Update `client/package.json`**:
    - Add `"homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>"` at the top level.
    - Add to `scripts`:
      ```json
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
      ```
4.  **Configure Vite**:
    - In `client/vite.config.js`, set `base`:
      ```js
      export default defineConfig({
         base: '/<REPO_NAME>/', 
         // ... other config
      })
      ```
5.  **Deploy**:
    ```bash
    npm run deploy
    ```

## 4. Final Success!
Visit `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>` to see your live app!
