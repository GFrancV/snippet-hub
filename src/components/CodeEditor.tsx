import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface Props {
  language:
    | "javascript"
    | "typescript"
    | "python"
    | "java"
    | "csharp"
    | "html"
    | "css";
}

export default ({ language }: Props) => {
  const options = {
    minimap: {
      enabled: false,
    },
  };

  const [code, setCode] = useState<string>("");

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      const snippetInput = document.getElementById(
        "snippet"
      ) as HTMLInputElement;
      if (snippetInput) {
        snippetInput.value = value;
      }
    }
  };

  return (
    <>
      <Editor
        height="340px"
        theme="vs-dark"
        defaultLanguage={language}
        onChange={handleEditorChange}
        defaultValue="console.log('Hello world!')"
        options={options}
      />

      <input type="hidden" name="code" value={code} />
    </>
  );
};
