# AI Exam Judge

**An online coding exam platform for college use.**  
It features a browser-based code editor, a live output panel, and AI-assisted judging.

---

## 🎯 What this is  
This project is a **web-based system** designed to modernize programming exams:  
- Students can **write code online** using a professional-grade editor.
- They can **run and test** their code instantly using the integrated terminal.
- An **automated AI judging system** (powered by Gemini) evaluates submissions, assigns marks, and provides constructive feedback.
- All results and submissions are securely stored in **Firebase** and tied to student profiles.

---

## 🚀 Features
### ✅ Implemented
- **Monaco Editor Integration**: A high-performance code editor with C syntax highlighting.
- **Live Code Execution**: Real-time code execution using the Piston API.
- **AI Question Generation**: Dynamic generation of C programming questions based on specific topics and difficulty levels.
- **AI Evaluation**: Automated grading and review of student submissions using Google Gemini.
- **Authentication**: Secure login system using Firebase Authentication.
- **Firestore Integration**: Persistent storage for student profiles and exam submissions.
- **Responsive Design**: Optimized for desktop use with tab-switch alerts to maintain exam integrity.

### 🔧 Planned / In development
- Teacher dashboard for managing exams and reviewing AI grades.
- Advanced plagiarism detection.
- Support for multiple programming languages.
- Real-time proctoring features.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI.
- **Backend**: Node.js, Express.
- **Database & Auth**: Firebase (Firestore & Auth).
- **AI**: Google Gemini API.
- **Code Execution**: Piston API.
- **Editor**: Monaco Editor.

---

## 📦 Project Structure
- `src/`: Frontend source code.
  - `backend/`: Express server and AI logic.
  - `components/`: Reusable UI components.
- `pages/`: Main application views (Login, Workspace).
- `public/`: Static assets.

---

## ⚙️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd code-terminal-c
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```dotenv
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the application**:
   - **Frontend**: `npm run dev`
   - **Backend**: `node src/backend/server.js` (Runs on port 3001)
