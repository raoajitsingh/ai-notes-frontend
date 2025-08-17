//NotesForm.jsx-->frontend

import { useState } from "react";
import clsx from "clsx";

const COLORS = [
  { name: "Gray", value: "#F3F4F6" },
  { name: "Yellow", value: "#FEF3C7" },
  { name: "Blue", value: "#DBEAFE" },
  { name: "Green", value: "#D1FAE5" },
  { name: "Pink", value: "#FCE7F3" },
];

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    setSaving(true);
    await onCreate({
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      color,
      pinned: false,
    });

    // reset form
    setTitle("");
    setContent("");
    setTags("");
    setColor(COLORS[0].value);
    setSaving(false);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      submit(e);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow p-4 border">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          className="w-full md:w-1/3 border rounded-lg px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full md:flex-1 border rounded-lg px-3 py-2"
          placeholder="Tags (e.g. work, project, personal)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <select
          className="w-full md:w-40 border rounded-lg px-3 py-2"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          {COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          disabled={saving}
          className={clsx(
            "w-full md:w-32 rounded-lg px-3 py-2 text-white",
            saving ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          )}
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </div>

      <textarea
        autoFocus
        className="mt-3 w-full border rounded-lg px-3 py-2 min-h-[90px]"
        placeholder="Take a note... (Ctrl+Enter to save)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}
