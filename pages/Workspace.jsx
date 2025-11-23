import { useState } from "react";
import { Editor } from "@monaco-editor/react";

function Workspace() {
  const [value, setValue] = useState("");

  return (
    <div className="p-5 h-screen">
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between  bg-[#161a1f] p-2 rounded-t-2xl overflow-hidden border border-gray-300 shadow">
            <div className="">
              main.c
            </div>

            <button className="btn">Run</button>
          </div>

          <div className="bg-[#1E1E1E] p-5 h-[80vh] w-[50vw]  rounded-b-2xl overflow-hidden border border-gray-300 shadow">
            <Editor
              height="75vh"
              defaultLanguage="c"
              theme="vs-dark"
              defaultValue="//Write your code here."
              value={value}
              onchange={(value) => setValue(value)}
            />
          </div>
        </div>

        <div>
          <textarea
            className="bg-black h-[80vh] ml-5 p-5 w-[50vw] rounded-2xl overflow-hidden border border-gray-300 shadow"
            name=""
            id=""></textarea>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
