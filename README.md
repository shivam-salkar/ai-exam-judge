AI Exam Judge
============

A web exam environment for first-semester C programming labs. Students sign in, receive an AI-generated question, code in the browser with Monaco, run C programs via Piston, and submit for automated Gemini-based evaluation. Results are stored in Firestore against the student profile.

## Features
- **Login/Signup with profiles**: Email/password auth via Firebase; user name and roll stored in Firestore.
- **AI-generated questions**: Gemini 1.5 Flash produces a single C question per session (functions, recursion, arrays, 2D arrays, strings, control flow). Requests are throttled server-side.
- **Exam flow with timer**: Students must click Start to reveal the question and begin a 60-minute timer; question and start time persist in localStorage per user to survive refreshes.
- **Code editing and execution**: Monaco editor with C syntax; run code through the Piston API (C 10.2.0) with stdin support; output and stderr shown together.
- **Submission and grading**: Backend posts question/code/output to Gemini for marking and review; results are shown in-app and stored in Firestore submissions.
- **Integrity helpers**: (Optional) tab/window switch alert hook; mobile is blocked to keep a controlled environment.

## Tech Stack
- Frontend: React 19, Vite, Tailwind/DaisyUI, Monaco editor
- Backend: Node.js (ESM), Express
- AI: Google Gemini via `@google/genai`
- Auth/DB: Firebase Auth and Firestore Database
- Code execution: Piston API

## Project Structure
- [src/main.jsx](src/main.jsx) – Vite entry and router bootstrap
- [src/App.jsx](src/App.jsx) – Routes for login and workspace
- [pages/Login.jsx](pages/Login.jsx) – Auth + profile creation flow
- [pages/Workspace.jsx](pages/Workspace.jsx) – Editor, timer, run/submit UI, Firestore writes
- [src/components/QuestionCard.jsx](src/components/QuestionCard.jsx) – Question modal + start gate
- [src/components/useTabSwitchAlert.jsx](src/components/useTabSwitchAlert.jsx) – Optional tab/window change alerts
- [src/firebase.js](src/firebase.js) – Firebase initialization
- [src/backend/server.js](src/backend/server.js) – Express API surface
- [src/backend/questionGenerator.js](src/backend/questionGenerator.js) – Gemini prompts for question + evaluation

## API (backend on :3001)
- `GET /api/question` – Returns a Gemini-generated C question (JSON). 5-second throttle to prevent rapid retries.
- `POST /api/submit` – Body: `{ question, code, output }`. Returns `{ marks, review }` from Gemini evaluation.

## Environment Variables
Create a `.env` at the repo root (used by both Vite and the backend):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
GEMINI_API_KEY=your_gemini_api_key
```

## Run the app
1) Install dependencies
   - `npm install`

2) Start the backend (port 3001)
   - `node src/backend/server.js`

3) Start the frontend (default Vite port 5173)
   - `npm run dev`

Keep both servers running; the frontend calls the backend at `http://localhost:3001`.

## Typical flow
1) Sign up or sign in (name, roll, email, password). Profile is created in Firestore on first login.
2) Click “Start Exam” to fetch the question and begin the 60-minute timer (question and start time are cached per user in localStorage).
3) Write code in Monaco, add stdin in the Input panel, and click Run to execute via Piston; combined stdout/stderr appears in Output.
4) Submit to trigger Gemini evaluation; marks and review display in a modal and are stored in Firestore submissions.
5) Logout clears cached exam data for that user.

## Notes
- Desktop only: mobile UI is intentionally blocked.
- Avoid rapid question refreshes (5s throttle). Backend sets cache headers to prevent stale responses.
- For Gemini model discovery, run `node listmodels.js` (requires `GEMINI_API_KEY`).
