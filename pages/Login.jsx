import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../src/firebase";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    if (!name || !roll || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
  
    let userCredential;
  
    try {
      // 1️⃣ Try signing in
      userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (signInError) {
      try {
        // 2️⃣ If sign-in fails, try registering
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (signUpError) {
        // 3️⃣ Real error (weak password, invalid email, etc.)
        setError(signUpError.message);
        setLoading(false);
        return;
      }
    }
  
    const uid = userCredential.user.uid;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
  
    // 4️⃣ Create Firestore profile if new user
    if (!snap.exists()) {
      await setDoc(ref, {
        name,
        roll,
        email,
        score: 0,
        createdAt: new Date(),
      });
    }
  
    setLoading(false);
    navigate("/workspace");
  };


  return (
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="card w-102 bg-base-100 shadow-xl ">
        <div className="card-body">
          <h2 className="text-center tracking-widest text-3xl m-4 font-extrabold">
            LOGIN / SIGN UP
          </h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input input-bordered w-full"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="input input-bordered w-full"
              placeholder="Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />

            <input
              className="input input-bordered w-full"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input input-bordered w-full"
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-full text-2xl p-7 mt-3"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>
          
          <div className="flex flex-row items-center text-center justify-center mt-4 gap-4 text-lg">
            
            <h1>Secured by </h1>
            
            <img width="24" height="24" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-firebase-a-googles-mobile-platform-that-helps-you-quickly-develop-high-quality-apps-logo-color-tal-revivo.png" alt="external-firebase-a-googles-mobile-platform-that-helps-you-quickly-develop-high-quality-apps-logo-color-tal-revivo"/>
            
          </div>
        </div>
      </div>
    </div>
  );
}
