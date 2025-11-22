import "/src/App.css";

import React from "react";

export default function Login() {
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

            <form className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your VIT email (eg. your.name@vit.edu.in)"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="name"
                  placeholder="Enter Your Name (eg. Shivam Salkar)"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Roll No.</span>
                </label>
                <input
                  type="id"
                  placeholder="Enter your Roll No. (eg. 25102B0047)"
                  className="input input-bordered w-full"
                />
              </div>

              <button className="btn btn-primary w-full mt-4">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
