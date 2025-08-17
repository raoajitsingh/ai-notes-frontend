// SearchBar.jsx-->frontend

import { useMemo } from "react";
import clsx from "clsx";

export default function SearchBar({
  notes,
  searchText,
  setSearchText,
  selectedTags,
  toggleTag,
  clearFilters,
}) {
  // collect unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:flex-1 border rounded-lg px-3 py-2"
          placeholder="Search by title or tag…"
        />
        <div className="flex gap-2">
          {(searchText || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm px-3 py-2 rounded border bg-gray-50 hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {allTags.length > 0 && (
        <>
          <div className="mt-3 text-xs text-gray-600">Filter by tags:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={clsx(
                    "text-xs rounded-full px-3 py-1 border",
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-100"
                  )}
                  title={
                    active
                      ? "Click to remove tag filter"
                      : "Click to filter by this tag"
                  }
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
