import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Workspace from "../pages/Workspace";
import Login from "../pages/Login";

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/workspace" element={<Workspace />}></Route>
      </Routes>
    </div>
  );
}

export default App;
