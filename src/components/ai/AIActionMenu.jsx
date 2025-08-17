//AIActionMenu.jsx-->frontend

import { useState } from "react";
import api, { sleep } from "../../api/client";
import Modal from "../ui/Modal";

const TASKS = [
  { key: "summarize", label: "Summarize" },
  { key: "rewrite", label: "Rewrite" },
  { key: "expand", label: "Expand" },
  { key: "actions", label: "Extract To-Dos" },
  { key: "translate", label: "Translate → Hindi", language: "hi" },
];

export default function AIActionMenu({
  note,
  onApply,
  layout = "row",
  aiMode = "lite",
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");

  async function run(task, language) {
    if (busy) return;
    setBusy(true);
    setOpen(true);
    setResult("Thinking…");
    await sleep(200);
    try {
      const { data } = await api.post("/ai", {
        task,
        content: note.content,
        ...(language ? { language } : {}),
        mode: aiMode, //  send mode to backend
      });
      setResult(data.result || "(no result)");
    } catch (e) {
      setResult(e?.response?.data?.error || "AI error");
    } finally {
      setBusy(false);
    }
  }

  function applyToNote() {
    if (!result) return;
    const replace = /\b(Rewritten|Expansion|Translated|Summary)\b/i.test(
      result
    );
    const newContent = replace ? result : `${note.content}\n\n${result}`;
    onApply(newContent);
    setOpen(false);
  }

  // Notes layout
  const container =
    layout === "row" ? "flex flex-wrap gap-2" : "flex flex-col gap-2 w-full";

  return (
    <div>
      <div className={container}>
        {TASKS.map((t) => (
          <button
            key={t.key}
            disabled={busy}
            onClick={() => run(t.key, t.language)}
            className="text-xs border rounded px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            {t.label}
          </button>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title={`AI Result (${aiMode === "lite" ? "Lite" : "Detailed"})`}
      >
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        <div className="mt-3 flex justify-end gap-2">
          <button
            className="text-sm px-3 py-1 rounded border"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Close
          </button>
          <button
            className="text-sm px-3 py-1 rounded bg-black text-white"
            onClick={applyToNote}
            disabled={busy}
          >
            Apply to Note
          </button>
        </div>
      </Modal>
    </div>
  );
}
