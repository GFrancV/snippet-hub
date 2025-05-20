import React, { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { Tables } from "../lib/database.types";

interface TagsManagerProps {
  initialTags?: string[];
  onTagsChange?: (tags: number[]) => void;
}

const TagsManager: React.FC<TagsManagerProps> = ({
  initialTags = [],
  onTagsChange,
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [newTagInput, setNewTagInput] = useState<string>("");
  const [availableTags, setAvailableTags] = useState<Tables<"tags">[]>([]);
  const tagsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAvailableTags = async () => {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data: Tables<"tags">[] = await response.json();
        setAvailableTags(data);
      } else {
        console.error("Error fetching available tags");
      }
    };

    fetchAvailableTags();
  }, []);

  useEffect(() => {
    if (tagsInputRef.current) {
      tagsInputRef.current.value = JSON.stringify(selectedTagIds);
    }
    if (onTagsChange) {
      onTagsChange(selectedTagIds);
    }
  }, [selectedTagIds, onTagsChange]);

  const handleTagSelection = (tagObject: Tables<"tags">) => {
    if (!selectedTagIds.includes(tagObject.id)) {
      const updatedTagIds = [...selectedTagIds, tagObject.id];
      setSelectedTagIds(updatedTagIds);
    }
  };

  const handleRemoveTag = (tagIdToRemove: number) => {
    const updatedTagIds = selectedTagIds.filter((id) => id !== tagIdToRemove);
    setSelectedTagIds(updatedTagIds);
  };

  const handleNewTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTagInput(event.target.value);
  };

  const handleCreateNewTag = async () => {
    if (newTagInput.trim()) {
      const newTagName = newTagInput.trim();
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag: newTagName }),
      });

      if (response.ok && response.status === 201) {
        const newTagObject: Tables<"tags"> = await response.json();
        setAvailableTags([...availableTags, newTagObject]);
        setSelectedTagIds([...selectedTagIds, newTagObject.id]);
        setNewTagInput("");
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(`Error al crear la etiqueta: ${errorData.message}`);
      } else if (response.status === 401) {
        alert("Not authorized to create labels.");
      } else if (response.status === 429) {
        alert("You have reached the tag creation limit.");
      } else if (response.status === 409) {
        alert("The label already exists.");
      } else {
        alert("Error creating label.");
      }
    }
  };

  const getTagNameById = (tagId: number) => {
    const foundTag = availableTags.find(({ id }) => id === tagId);
    return foundTag ? foundTag.name : "";
  };

  return (
    <div className="mt-4 mb-8">
      <h3 className="text-2xl font-semibold text-[#f1f1ef] mb-2">Tags</h3>
      <p className="text-body text-neutral-300 text-sm">
        Add tags to help others find your snippet. Tags should be relevant to
        the content.
      </p>

      <div className="flex gap-2 mt-4">
        <input
          className="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full"
          type="text"
          placeholder="Add Tag..."
          value={newTagInput}
          onChange={handleNewTagInputChange}
        />
        <button
          className=" gap-1 border border-fuchsia-200 back rounded-full px-4 py-1.5 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer"
          type="button"
          onClick={handleCreateNewTag}
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 my-4">
        {selectedTagIds.map((tagId) => (
          <span
            key={tagId}
            onClick={() => handleRemoveTag(tagId)}
            className="text-[#f1f1ef] inline-flex gap-2 items-center rounded-full border border-fuchsia-200/75 px-2.5 py-0.5 text-sm font-semibold transition-colors cursor-pointer hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
          >
            {getTagNameById(tagId)}
            <span>x</span>
          </span>
        ))}
        {selectedTagIds.length === 0 && (
          <p className="text-body text-neutral-300 italic">
            Aún no has seleccionado etiquetas.
          </p>
        )}
      </div>

      <div className="pt-5 border-t border-neutral-600">
        <h4 className="text-xl font-semibold text-[#f1f1ef] mb-2">
          Add Existing Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tagObject) => (
            <span
              key={tagObject.id}
              className="text-[#f1f1ef] inline-flex gap-2 items-center rounded-full border border-fuchsia-200/75 px-2.5 py-0.5 text-sm font-semibold transition-colors cursor-pointer hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
              onClick={() => handleTagSelection(tagObject)}
            >
              {tagObject.name}
            </span>
          ))}
          {availableTags.length === 0 && (
            <p className="text-body text-neutral-300 italic my-4">
              No tags available
            </p>
          )}
        </div>
      </div>

      <input
        type="hidden"
        name="tags"
        ref={tagsInputRef}
        value={JSON.stringify(selectedTagIds)}
      />
    </div>
  );
};

export default TagsManager;
