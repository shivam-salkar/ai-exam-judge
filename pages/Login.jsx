import React from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/workspace');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-light text-center mb-4 tracking-[0.5em]">LOGIN</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your VIT email (eg. your.name@vit.edu.in)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter Your Name (eg. Shivam Salkar)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Roll No.</span>
              </label>
              <input
                name="roll"
                type="text"
                placeholder="Enter your Roll No. (eg. 25102C0026)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
