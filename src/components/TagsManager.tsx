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
        alert("No autorizado para crear etiquetas.");
      } else if (response.status === 429) {
        alert("Has alcanzado el límite de creación de etiquetas.");
      } else if (response.status === 409) {
        alert("La etiqueta ya existe.");
      } else {
        alert("Error al crear la etiqueta.");
      }
    }
  };

  const getTagNameById = (tagId: number) => {
    const foundTag = availableTags.find(({ id }) => id === tagId);
    return foundTag ? foundTag.name : "";
  };

  return (
    <div>
      <h3>Etiquetas</h3>
      <div className="selected-tags">
        {selectedTagIds.map((tagId) => (
          <span key={tagId} className="tag">
            {getTagNameById(tagId)}{" "}
            <button type="button" onClick={() => handleRemoveTag(tagId)}>
              x
            </button>
          </span>
        ))}
        {selectedTagIds.length === 0 && (
          <p className="empty-message">Aún no has seleccionado etiquetas.</p>
        )}
      </div>

      <h4>Añadir Etiquetas Existentes</h4>
      <div className="available-tags">
        {availableTags.map((tagObject) => (
          <button
            key={tagObject.id}
            type="button"
            onClick={() => handleTagSelection(tagObject)}
          >
            {tagObject.name}
          </button>
        ))}
        {availableTags.length === 0 && (
          <p className="empty-message">No hay etiquetas disponibles.</p>
        )}
      </div>

      <h4>Crear Nueva Etiqueta</h4>
      <div className="create-new-tag">
        <input
          type="text"
          placeholder="Nueva etiqueta"
          value={newTagInput}
          onChange={handleNewTagInputChange}
        />
        <button type="button" onClick={handleCreateNewTag}>
          Crear
        </button>
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
