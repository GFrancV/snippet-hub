import { type FormEvent } from "react";
import CodeEditor from "./CodeEditor";

export default () => {
  const labelClasses = "text-2xl font-semibold text-[#f1f1ef] mb-2";
  const inputClasses =
    "block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataToSend = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      code: formData.get("code") as string,
      language: formData.get("language") as string,
    };

    const response = await fetch("/api/snippets.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const data = await response.json();
    if (data.message) {
      console.log(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className={labelClasses}>Title</label>
        <input
          type="text"
          className={inputClasses}
          name="title"
          placeholder="Enter the title of the snippet"
          aria-label="Snippet title"
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}> Description</label>
        <textarea
          className={`${inputClasses} h-26 resize-none`}
          name="description"
          placeholder="Enter the title of the snippet"
          aria-label="Snippet title"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className={labelClasses}> Snippet</label>
        <CodeEditor language="javascript" />
      </div>

      <input type="hidden" name="language" value="javascript" />

      <button className="flex gap-1 border border-transparent back rounded-full px-4 py-2 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer">
        Submit
      </button>
    </form>
  );
};
