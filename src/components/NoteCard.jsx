//NoteCard.jsx-->frontend

import { useState, useMemo } from "react";
import AIActionMenu from "./ai/AIActionMenu";

function formatTS(note) {
  const ts = new Date(note.updatedAt || note.createdAt);
  return ts.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoteCard({
  note,
  onPin,
  onUpdate,
  onDelete,
  aiMode = "lite",
}) {
  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const ts = useMemo(() => formatTS(note), [note.updatedAt, note.createdAt]);

  async function save() {
    await onUpdate(note._id, { title, content });
    setEditing(false);
  }

  return (
    <div
      className="h-full rounded-xl border shadow p-4 flex flex-col gap-3 transition-transform hover:-translate-y-[2px]"
      style={{ backgroundColor: note.color || "#fff" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <input
            className="w-full border rounded px-2 py-1 font-semibold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
          />
        ) : (
          <h3 className="font-semibold text-lg break-words">
            {note.title || "Untitled"}
          </h3>
        )}

        <button
          className="text-xs rounded px-2 py-1 border bg-white/70 hover:bg-white"
          onClick={onPin}
          title="Pin/Unpin"
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          className="w-full border rounded px-2 py-1 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note…"
        />
      ) : (
        <p className="text-sm whitespace-pre-wrap break-words">
          {note.content}
        </p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-white/80 rounded-full px-3 py-0.5 border shadow-sm"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isEditing ? (
            <>
              <button
                className="text-xs bg-black text-white rounded px-3 py-1"
                onClick={save}
              >
                Save
              </button>
              <button
                className="text-xs bg-gray-200 rounded px-3 py-1"
                onClick={() => {
                  setTitle(note.title);
                  setContent(note.content);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="text-xs bg-gray-900 text-white rounded px-3 py-1"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="text-xs bg-red-600 text-white rounded px-3 py-1"
                onClick={onDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* AI Actions layout*/}
        <div className="flex flex-wrap gap-2 justify-start">
          <AIActionMenu
            note={note}
            onApply={(newContent) =>
              onUpdate(note._id, { content: newContent })
            }
            layout="row"
            aiMode={aiMode}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 text-gray-600 text-xs">
        <span>{note.pinned ? "Pinned • " : ""}Last updated</span>
        <span>{ts}</span>
      </div>
    </div>
  );
}
