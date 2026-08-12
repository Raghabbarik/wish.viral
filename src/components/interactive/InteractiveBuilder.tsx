// src/components/interactive/InteractiveBuilder.tsx
import React, { useState } from "react";
import { InteractiveTemplate, InteractiveQuestion, QuestionType, InteractiveOption, FinalSurprise } from "../../types";
import { saveInteractiveTemplate } from "../../admin/services/adminService";
import { Plus, Trash2 } from "lucide-react";

export const InteractiveBuilder: React.FC = () => {
  const [template, setTemplate] = useState<Partial<InteractiveTemplate>>({
    title: "",
    description: "",
    thumbnail: "",
    isPremium: false,
    category: "birthday",
    questions: [],
    finalSurprise: { type: "text", content: "" },
    settings: { attemptsMode: "unlimited", allowHints: false },
  });
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    const newQ: InteractiveQuestion = {
      id: "q-" + Date.now(),
      type: "multiple",
      prompt: "New Question",
      options: [
        { id: "opt-1", label: "Option 1" },
        { id: "opt-2", label: "Option 2" }
      ],
      correctOptionId: "opt-1",
      order: (template.questions?.length || 0) + 1
    };
    setTemplate({
      ...template,
      questions: [...(template.questions || []), newQ]
    });
  };

  const updateQuestion = (idx: number, key: keyof InteractiveQuestion, value: any) => {
    const updated = (template.questions || []).map((q, i) =>
      i === idx ? { ...q, [key]: value } : q
    );
    setTemplate({ ...template, questions: updated });
  };

  const removeQuestion = (id: string) => {
    setTemplate({
      ...template,
      questions: (template.questions || []).filter((q) => q.id !== id)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template.title) return;
    setSaving(true);
    try {
      await saveInteractiveTemplate(template as InteractiveTemplate);
      alert("Interactive template saved!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1a24] text-white rounded-xl space-y-6">
      <h2 className="text-2xl font-bold">Create Interactive Surprise Template</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full px-3 py-2 rounded bg-[#0f0f14] border border-white/10"
            value={template.title || ""}
            onChange={(e) => setTemplate({ ...template, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-[#0f0f14] border border-white/10"
            value={template.description || ""}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full px-3 py-2 rounded bg-[#0f0f14] border border-white/10"
            value={template.category || "birthday"}
            onChange={(e) => setTemplate({ ...template, category: e.target.value as any })}
          >
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="graduation">Graduation</option>
            <option value="wedding">Wedding</option>
            <option value="valentine">Valentine</option>
            <option value="festival">Festival</option>
          </select>
        </div>
        {/* Questions */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Questions</h3>
            <button type="button" onClick={addQuestion} className="flex items-center gap-1 px-3 py-1 bg-violet-600 hover:bg-violet-700 rounded text-xs">
              <Plus size={14} /> Add Question
            </button>
          </div>
          {(template.questions || []).map((q, i) => (
            <div key={q.id} className="bg-white/5 p-3 rounded-lg mb-3">
              <div className="flex items-center justify-between mb-1">
                <input
                  className="flex-1 px-2 py-1 bg-[#0f0f14] rounded mr-2"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(i, "prompt", e.target.value)}
                />
                <select
                  className="px-2 py-1 bg-[#0f0f14] rounded mr-2"
                  value={q.type}
                  onChange={(e) => updateQuestion(i, "type", e.target.value as QuestionType)}
                >
                  <option value="multiple">Multiple Choice</option>
                  <option value="truefalse">True / False</option>
                  <option value="imagechoice">Image Choice</option>
                </select>
                <button type="button" onClick={() => removeQuestion(q.id)} className="p-1 text-red-400 hover:text-red-300">
                  <Trash2 size={14} />
                </button>
              </div>
              {(q.type === "multiple" || q.type === "imagechoice") && (
                <div className="space-y-2 ml-4">
                  {(q.options || []).map((opt, oi) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <input
                        className="flex-1 px-2 py-1 bg-[#0f0f14] rounded"
                        value={opt.label}
                        placeholder="Option label"
                        onChange={(e) => {
                          const newOpts = q.options!.map((o) =>
                            o.id === opt.id ? { ...o, label: e.target.value } : o
                          );
                          updateQuestion(i, "options", newOpts);
                        }}
                      />
                      <input
                        type="radio"
                        checked={q.correctOptionId === opt.id}
                        onChange={() => updateQuestion(i, "correctOptionId", opt.id)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOption: InteractiveOption = {
                        id: "opt-" + Date.now(),
                        label: "New Option"
                      };
                      updateQuestion(i, "options", [...(q.options || []), newOption]);
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-violet-600 hover:bg-violet-700 rounded"
                  >
                    <Plus size={12} /> Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Final Surprise */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-semibold mb-2">Final Surprise</h3>
          <select
            className="w-full px-3 py-2 rounded bg-[#0f0f14] border border-white/10 mb-2"
            value={template.finalSurprise?.type || "text"}
            onChange={(e) => setTemplate({ ...template, finalSurprise: { ...(template.finalSurprise || {}), type: e.target.value as any } })}
          >
            <option value="text">Message</option>
            <option value="photo">Photo</option>
            <option value="gallery">Gallery</option>
            <option value="video">Video</option>
            <option value="music">Music</option>
          </select>
          <textarea
            className="w-full px-3 py-2 rounded bg-[#0f0f14] border border-white/10"
            placeholder="Content for the surprise (text, URL, etc.)"
            value={template.finalSurprise?.content || ""}
            onChange={(e) => setTemplate({ ...template, finalSurprise: { ...(template.finalSurprise || {}), content: e.target.value } })}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={() => setTemplate({})} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm">
            Reset
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Template"}
          </button>
        </div>
      </form>
    </div>
  );
};
