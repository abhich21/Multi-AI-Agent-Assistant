# Deployment Guide

This guide explains how to deploy the Multi-AI Agent Chatbot to **Render** (Backend) and **Netlify** (Frontend) for free.

## 1. Backend Deployment (Render)

Render offers a free tier for Node.js web services.

1.  **Push your code to GitHub** (you've already done this).
2.  **Sign up/Login to [Render](https://render.com/)**.
3.  Click **"New +"** and select **"Web Service"**.
4.  Connect your GitHub repository (`Multi-AI-Agent-Assistant`).
5.  Configure the service:
    - **Name**: `multi-ai-agent-backend` (or similar)
    - **Root Directory**: `backend`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Instance Type**: `Free`
6.  Click **"Create Web Service"**.
7.  Wait for the deployment to finish. Render will provide a URL (e.g., `https://multi-ai-agent-backend.onrender.com`). **Copy this URL.**

## 2. Frontend Deployment (Netlify)

Netlify is excellent for deploying static sites and React apps.

1.  **Sign up/Login to [Netlify](https://www.netlify.com/)**.
2.  Click **"Add new site"** -> **"Import from existing project"**.
3.  Select **GitHub**.
4.  Authorize Netlify and choose your repository (`Multi-AI-Agent-Assistant`).
5.  Configure the build settings:
    - **Base directory**: `frontend`
    - **Build command**: `npm run build`
    - **Publish directory**: `frontend/dist`
6.  **Environment Variables**:
    - Click on **"Advanced"** or **"Environment variables"**.
    - Add a new variable:
      - **Key**: `VITE_API_URL`
      - **Value**: The Render Backend URL you copied earlier (e.g., `https://multi-ai-agent-backend.onrender.com/api`)
      - _Note: Make sure to append `/api` to the end of the URL._
7.  Click **"Deploy site"**.

## 3. Verification

1.  Open your deployed Netlify URL.
2.  Try sending a message (e.g., "Summary of October sales").
3.  Verify that the bot responds and the "Download PDF" button works.

## Troubleshooting

- **CORS Issues**: If the frontend cannot talk to the backend, ensure your backend allows the Netlify domain.
  - _Current setup_: The backend `server.js` uses `cors()`, which allows all origins by default. This is fine for testing but should be restricted for production.
- **Cold Starts**: The Render free tier spins down after inactivity. The first request might take 50+ seconds. Be patient!
