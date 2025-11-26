# Multi-AI Agent Chatbot

A full-stack application featuring a Node.js Express backend with intelligent AI agents (Sales, Report, Summary) and a React frontend with a beautiful dark-themed chat interface.

![Multi-AI Agent System](https://img.shields.io/badge/AI-Multi--Agent-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/React-Vite-purple)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## 🎯 Overview

This project implements a multi-AI agent system where three specialized agents collaborate to process sales-related queries:

- **Sales Agent**: Fetches raw revenue data
- **Report Agent**: Creates structured analytics reports
- **Summary Agent**: Generates concise, user-friendly summaries

The system intelligently routes queries based on intent and provides optional PDF downloads for reports and summaries.

## ✨ Features

### Backend

- 🤖 **Intelligent Query Routing** - Automatically detects user intent (sales/report/summary)
- 📊 **Multi-Agent Collaboration** - Three specialized agents work together
- 📄 **PDF Generation** - Download professional reports (for report and summary queries)
- 🔄 **RESTful API** - Clean JSON responses with full execution details
- 📈 **Sample Data** - Pre-loaded sales data for September, October, November

### Frontend

- 🎨 **Modern Dark Theme** - Beautiful gradient UI like ChatGPT/Gemini
- 💬 **Real-time Chat Interface** - Smooth message flow with typing indicators
- 📱 **Responsive Design** - Works on desktop and mobile
- 🏷️ **Agent Badges** - Visual indicators showing which agents processed each query
- ⬇️ **Conditional PDF Downloads** - Download button appears only when PDF is available
- 🔄 **Session-based Chat** - Conversation persists until page refresh

## 📸 Screenshots

![Screenshot 1](assets/ss1.png)
![Screenshot 2](assets/ss2.png)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

To verify your installation:

```bash
node --version
npm --version
```
