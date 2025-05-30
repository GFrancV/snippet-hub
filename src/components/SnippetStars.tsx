import { useEffect, useState } from "react";

type StarButtonProps = {
  id: string;
};

const SnippetStars: React.FC<StarButtonProps> = ({ id }) => {
  const [stars, setStars] = useState<number>(0);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  const toggleStar = () => {
    fetch(`/api/snippets/${id}/stars`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          const newStarred = !isStarred;
          setIsStarred(newStarred);
          setStars((prev) => prev + (newStarred ? 1 : -1));
        } else {
          console.error("Error toggling star:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error toggling star:", error);
      });
  };

  const getStars = () => {
    fetch(`/api/snippets/${id}/stars`)
      .then((response) => response.json())
      .then((data) => {
        setStars(data.stars);
      })
      .catch((error) => {
        console.error("Error fetching stars:", error);
      });
  };

  const checkStarred = async () => {
    const response = await fetch(`/api/snippets/${id}/starred`);

    if (response.ok) {
      const data = await response.json();
      setIsStarred(data);
    } else {
      setIsStarred(false);
    }
  };

  useEffect(() => {
    getStars();
    checkStarred();
  }, [id]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleStar}
        className={`flex items-center gap-2 p-1 border border-white/10 rounded cursor-pointer transition duration-300 ${
          isStarred
            ? "bg-fuchsia-300/30 hover:bg-fuchsia-300/40"
            : "hover:bg-neutral-800"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-5 ${
            isStarred
              ? "fill-fuchsia-300 stroke-fuchsia-200"
              : "stroke-neutral-300"
          }`}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
        </svg>
      </button>
      <span className="text-sm text-neutral-300">{stars ?? 0}</span>
    </div>
  );
};

export default SnippetStars;
