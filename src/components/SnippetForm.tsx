import type { ZodIssue } from "astro:schema";
import { useState, type FormEvent } from "react";
import CodeEditor from "./CodeEditor";
import TagsManager from "./TagsManager";

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

  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<SnippetLanguages>("javascript");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const dataToSend = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      code: formData.get("code") as string,
      language: formData.get("language") as string,
      tags: JSON.parse(formData.get("tags") as string),
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
      setIsLoading(false);
      return;
    }

    setErrors({});
    setIsLoading(false);
    window.location.href = "/";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className={labelClasses}>Snippet Title</label>
        <input
          type="text"
          className={`${inputClasses} ${
            errors.title ? "border border-red-500" : "border-0"
          }`}
          name="title"
          placeholder="Ex: Animated CSS Button"
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
          <div>
            <label className={labelClasses}> Code editor</label>
            <p className="text-body text-neutral-300 text-sm">
              Type or paste your code. The editor will automatically highlight
              the syntax.
            </p>
          </div>

          <select
            name="language"
            className="h-fit py-2 px-6 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring-3 focus:ring-fuchsia-200 shadow-lg"
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

        <TagsManager />
      </div>

      <button
        className={`flex items-center gap-2 border border-transparent back rounded-full px-4 py-2 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer duration-300 ${
          isLoading && "opacity-75 cursor-progress"
        }`}
        disabled={isLoading}
      >
        {isLoading && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline size-6 animate-spin text-gray-600 fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        Submit
      </button>
    </form>
  );
};
