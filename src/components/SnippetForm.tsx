import type { ZodIssue } from "astro:schema";
import { useState, type FormEvent } from "react";
import CodeEditor from "./CodeEditor";

export default () => {
  const labelClasses = "block text-2xl font-semibold text-[#f1f1ef] mb-2";
  const inputClasses =
    "block bg-[#1e1e1e] rounded-sm text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full";
  const languages = [
    {
      name: "JavaScript",
      value: "javascript",
    },
    {
      name: "Python",
      value: "python",
    },
    {
      name: "Java",
      value: "java",
    },
    {
      name: "TypeScript",
      value: "typescript",
    },
    {
      name: "CSS",
      value: "css",
    },
    {
      name: "HTML",
      value: "html",
    },
  ];

  const [language, setLanguage] = useState<SnippetLanguages>("javascript");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (!response.ok) {
      const errorData: { message: string; errors: ZodIssue[] } =
        await response.json();
      if (errorData.errors) {
        const formattedErrors: { [key: string]: string } = {};
        errorData.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      }
      return;
    }

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
          className={`${inputClasses} ${
            errors.title ? "border border-red-500" : "border-0"
          }`}
          name="title"
          placeholder="Enter the title of the snippet"
          aria-label="Snippet title"
          required
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2">{errors.title}</p>
        )}
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
        <div className="flex justify-between mb-4">
          <label className={labelClasses}> Snippet</label>
          <select
            name="language"
            className="py-2 px-6 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring-3 focus:ring-fuchsia-200 shadow-lg"
            onChange={(e) => setLanguage(e.target.value as SnippetLanguages)}
            aria-label="Language"
          >
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <CodeEditor language={language} />
      </div>

      <button className="flex gap-1 border border-transparent back rounded-full px-4 py-2 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer">
        Submit
      </button>
    </form>
  );
};
