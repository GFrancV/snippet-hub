import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "src/utils/debounce";

const SearchBar = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SnippetApiResponse[] | null>(null);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      searchInput.current?.focus();
    }
  }

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setResults(null);
        return;
      }

      const response = await fetch(`/api/snippets.json?query=${query}`);
      if (!response.ok) {
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(data);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setResults(null);
    setQuery("");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative grow">
        <div className="pointer-events-none absolute translate-y-[-50%] left-0 flex items-center pl-3 h-fit inset-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="inherit"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-gray-600"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
            <path d="M21 21l-6 -6"></path>
          </svg>
        </div>

        <input
          ref={searchInput}
          value={query}
          onChange={handleInputChange}
          type="text"
          className="block ps-12 py-2 pr-3 bg-[#1e1e1e] rounded-sm w-full border-0 text-[#f1f1ef] outline-1 -outline-offset-1 outline-transparent transition duration-200 focus:outline-2 focus:-outline-offset-2 focus:outline-fuchsia-200 leading-6 placeholder:text-neutral-600"
          aria-label="Search snippets..."
          placeholder="Search snippets..."
        />

        <div className="absolute inset-y-1/2 translate-y-[-50%] right-0 flex items-center text-gray-600 pr-3 h-fit">
          {query.length <= 0 ? (
            <div className="flex items-center pointer-events-none text-base gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="stroke-gray-600 size-5"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path>
              </svg>
              <span>K</span>
            </div>
          ) : (
            <button onClick={clearSearch} className="text-white cursor-pointer">
              x
            </button>
          )}
        </div>
      </div>

      {results && (
        <div className="absolute z-10 w-full mt-2 bg-[#1e1e1e] rounded-md shadow-lg ">
          <div className="max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              <ul className="py-1">
                {results.map(({ id, title, language }, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-200 hover:bg-fuchsia-300/15"
                  >
                    <a
                      href={`/snippet/${id}`}
                      className="flex px-4 py-3 w-full"
                    >
                      <img
                        src={`/icons/${language}.svg`}
                        alt={`${language} logo`}
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-20">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
