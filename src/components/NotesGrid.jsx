//NotesGrid.jsx-->frontend

import NoteCard from "./NoteCard";

export default function NotesGrid({
  notes,
  loading,
  onPin,
  onUpdate,
  onDelete,
  aiMode,
}) {
  if (loading) return <p className="text-sm text-gray-500">Loading notes…</p>;
  if (!Array.isArray(notes) || notes.length === 0) {
    return <p className="text-sm text-gray-500">No notes yet.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {notes.map((n) => (
        <div key={n._id} className="h-full">
          <NoteCard
            note={n}
            onPin={() => onPin(n)}
            onUpdate={onUpdate}
            onDelete={() => onDelete(n._id)}
            aiMode={aiMode}
          />
        </div>
      ))}
    </div>
  );
}
