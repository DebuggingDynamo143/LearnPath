# 🌟 LearnPath – AI-Powered Personalized Learning Path Generator  

![Stars](https://img.shields.io/github/stars/DebuggingDynamo143/LearnPath?style=social)  
![Forks](https://img.shields.io/github/forks/DebuggingDynamo143/LearnPath?style=social)  
![Issues](https://img.shields.io/github/issues/DebuggingDynamo143/LearnPath)  
![License](https://img.shields.io/github/license/DebuggingDynamo143/LearnPath)  

---

## 📖 Description
**LearnPath** is an **AI-powered personalized learning path generator** that helps students, developers, and professionals design a **step-by-step roadmap** for mastering new skills.  
It supports **AI Mode** (with Gemini API) for real-time AI-generated paths, and **Demo Mode** (mock data) for users without an API key.  

> 🚀 Built with **Node.js + Express + Gemini AI + HTML/CSS/JS**, and deployed on **Vercel**.  

---

## ✨ Features
- 🔹 Enter one or more skills (e.g., *Python, Data Science, Machine Learning*).  
- 🔹 Generates a **personalized roadmap** with **duration, description, and resources**.  
- 🔹 Supports **AI-Powered Mode** (with Gemini API key).  
- 🔹 Supports **Demo Mode** (mock data for testing).  
- 🔹 Fully responsive **modern UI** with smooth interactions.  
- 🔹 Deployable on **Vercel** in one click.  

---

## 📂 Project Structure

LearnPath/
│── server.js # Backend server (Express + Gemini API)

│── index.html # Frontend (UI + Fetch API)

│── package.json # Dependencies & scripts

│── .env # Environment variables (local only)

│── .env.example # Sample environment file

│── .gitignore # Ignored files

│── README.md # Project documentation



---

## ⚡ Installation & Setup  

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DebuggingDynamo143/LearnPath.git
cd LearnPath

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the project root:

GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3001

4️⃣ Run Locally
npm run dev


Now open 👉 http://localhost:3001


🚀 Deployment on Vercel

Push your repo to GitHub.

Go to Vercel
 → Import GitHub Repo.

Add environment variable in Vercel dashboard:

GEMINI_API_KEY = your_google_gemini_api_key


Click Deploy 🎉



🔑 Modes

AI Mode → Requires Gemini API key, generates real AI learning paths.

Demo Mode → Works without API key, shows mock paths for testing.

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express

AI: Google Gemini API

Deployment: Vercel

⭐ Support

If you like this project, please consider giving it a star ⭐ on GitHub!
It helps others discover the project and motivates me to keep improving 🚀

💡 Built with passion for learners who dream big. ✨



