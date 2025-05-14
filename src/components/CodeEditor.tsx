import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface Props {
  language: SnippetLanguages;
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
        defaultLanguage="javascript"
        language={language}
        onChange={handleEditorChange}
        defaultValue="// Insert your code here"
        options={options}
      />

      <input type="hidden" name="code" value={code} />
    </>
  );
};
