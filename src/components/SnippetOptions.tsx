import { useEffect, useRef, useState } from "react";

interface Props {
  id: string;
}

const SnippetOptions = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const deleteSnippet = async () => {
    const response = await fetch(`/api/snippets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Snippet deleted successfully");
      window.location.href = "/";
    } else {
      console.error("Failed to delete snippet");
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          type="button"
          className="inline-flex w-full rounded-md bg-[#1e1e1e] text-sm text-[#f1f1ef] border border-white/10 p-1 transition duration-300 cursor-pointer hover:bg-fuchsia-300/15"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
          <span className="sr-only">Options</span>
        </button>
      </div>
      {isOpen && (
        <ul
          className="absolute right-0 z-10 w-32 origin-top-right mt-0.5 rounded-md bg-[#1e1e1e] shadow-lg ring-1 ring-black/5  focus:outline-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <li
            className="py-1 overflow-hidden transition duration-300 hover:bg-white/15"
            role="none"
          >
            <a
              href={`/snippet/${id}/edit`}
              className="flex px-4 py-2 text-sm text-[#f1f1ef] w-full cursor-pointer"
              role="menuitem"
              tabIndex={-1}
            >
              Edit
            </a>
          </li>
          <li
            className="py-1 overflow-hidden transition duration-300 hover:bg-red-700/20"
            role="none"
          >
            <button
              onClick={deleteSnippet}
              className="flex px-4 py-2 text-sm text-red-400 w-full cursor-pointer"
              role="menuitem"
              tabIndex={-1}
            >
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SnippetOptions;
