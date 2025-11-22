import { useState } from "react";
import { Editor } from "@monaco-editor/react";

function Workspace() {
  const [value, setValue] = useState("");

  return (
    <div className="p-5 h-screen">
      <div className="bg-[#1E1E1E] p-5 h-full rounded-xl overflow-hidden border border-gray-300 shadow">
        <Editor
          height="100%"
          defaultLanguage="c"
          theme="vs-dark"
          defaultValue="//Write your code here."
          value={value}
          onchange={(value) => setValue(value)}
        />
      </div>
    </div>
  );
}

export default Workspace;
