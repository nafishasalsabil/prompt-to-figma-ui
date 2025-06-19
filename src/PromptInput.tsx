import { useState } from "react";

export default function PromptInput({ onSubmit, loading }: { onSubmit: (prompt: string) => void, loading: boolean }) {
    const [prompt, setPrompt] = useState("");

    return (
        <div className="w-full flex flex-col items-center gap-2 mb-6 mt-6">
      <textarea
          className="border p-3 rounded w-full h-24"
          placeholder="Describe your UI (e.g., login form, profile card)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
      />
            <button
                className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 w-1/3"
                onClick={() => onSubmit(prompt)}
                disabled={!prompt.trim() || loading}
            >
                {loading ? "Generating..." : "Generate UI"}
            </button>
        </div>
    );
}