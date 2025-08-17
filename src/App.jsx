// App.jsx

const MODE_KEY = "ai_notes_mode";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext";
import api from "./api/client";

import NotesGrid from "./components/NotesGrid";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";
import Auth from "./pages/Auth";

function sortNotes(list) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

// --- Top-level gate: no conditional hooks except useAuth ---
export default function App() {
  const { token } = useAuth();
  return token ? <AuthedApp /> : <Auth />;
}

// --- All the notes logic, hooks run every render ---
function AuthedApp() {
  const { logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // search & filter state
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // AI mode toggle
  const [aiMode, setAiMode] = useState(
    localStorage.getItem(MODE_KEY) || "lite"
  );
  const toggleMode = () => {
    const next = aiMode === "lite" ? "detailed" : "lite";
    setAiMode(next);
    localStorage.setItem(MODE_KEY, next);
  };

  // API calls
  async function loadNotes() {
    setLoading(true);
    try {
      const { data } = await api.get("/notes");
      setNotes(sortNotes(Array.isArray(data) ? data : data?.notes ?? []));
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createNote(payload) {
    try {
      const { data } = await api.post("/notes", payload);
      setNotes((prev) => sortNotes([data, ...prev]));
    } catch (err) {
      console.error("Create note failed:", err);
    }
  }

  async function updateNote(id, patch) {
    try {
      const { data } = await api.put(`/notes/${id}`, patch);
      setNotes((prev) => sortNotes(prev.map((n) => (n._id === id ? data : n))));
    } catch (err) {
      console.error("Update note failed:", err);
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete note failed:", err);
    }
  }

  function toggleTag(tag) {
    setSelectedTags((curr) =>
      curr.includes(tag) ? curr.filter((t) => t !== tag) : [...curr, tag]
    );
  }

  function clearFilters() {
    setSearchText("");
    setSelectedTags([]);
  }

  const filteredNotes = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return notes.filter((n) => {
      const titleHit = q ? (n.title || "").toLowerCase().includes(q) : true;
      const tagHitFromQuery = q
        ? (n.tags || []).some((t) => t.toLowerCase().includes(q))
        : true;
      const tagHitFromSelection =
        selectedTags.length === 0
          ? true
          : (n.tags || []).some((t) => selectedTags.includes(t));
      return (titleHit || tagHitFromQuery) && tagHitFromSelection;
    });
  }, [notes, searchText, selectedTags]);

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            📝 AI Notes
          </h1>
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-xs px-2 py-1 rounded bg-gray-100">
              Backend: {import.meta.env.VITE_API_BASE}
            </div>
            <button
              onClick={logout}
              className="text-xs px-3 py-1 rounded border bg-white hover:bg-gray-100"
              title="Logout"
            >
              Logout
            </button>
            <button
              onClick={toggleMode}
              className="text-xs px-3 py-1 rounded border bg-white hover:bg-gray-100"
              title="Switch AI verbosity"
            >
              AI: {aiMode === "lite" ? "Lite" : "Detailed"}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SearchBar
          notes={notes}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          clearFilters={clearFilters}
        />

        <NoteForm onCreate={createNote} />

        <NotesGrid
          notes={filteredNotes}
          loading={loading}
          onPin={(note) => updateNote(note._id, { pinned: !note.pinned })}
          onUpdate={(id, patch) => updateNote(id, patch)}
          onDelete={(id) => deleteNote(id)}
          aiMode={aiMode}
        />
      </main>
    </div>
  );
}
