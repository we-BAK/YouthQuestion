import React, { useEffect, useState } from "react";
import { fetchQuestions } from "../../Services/questionService";
import { getCategories } from "../../Services/categoryService";
import EthiopianCross from "../../components/ui/EthiopianCross";
import Can from "../../components/auth/Can";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  HelpCircle,
  FolderKanban,
  BookOpen,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [catData, questionsData] = await Promise.all([
        getCategories().catch(() => []),
        fetchQuestions().catch(() => []),
      ]);

      setCategories(catData || []);
      setQuestions(questionsData || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const suggestedPresets = [
    "ቅዱሳት መጻሕፍት (Holy Scriptures)",
    "ሃይማኖተ አበው (Dogma & Faith)",
    "ሥነ-ምግባር (Christian Ethics)",
    "የቤተ ክርስቲያን ታሪክ (Church History)",
    "ሥርዓተ ቤተ ክርስቲያን (Church Liturgy)",
    "ጾምና ጸሎት (Fasting & Prayer)",
    "የወጣቶች ሕይወት (Youth & Modern Life)",
  ];

  async function handleAddCategory(e) {
    if (e) e.preventDefault();
    const nameToAdd = newCategory.trim();
    if (!nameToAdd) return;

    // Duplicate check
    const existing = categories.find(
      (c) => c.name.trim().toLowerCase() === nameToAdd.toLowerCase()
    );
    if (existing) {
      setError(`Category "${existing.name}" already exists.`);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data, error: insertErr } = await supabase
        .from("categories")
        .insert([{ name: nameToAdd }])
        .select();

      if (insertErr) throw insertErr;

      if (data && data.length > 0) {
        setCategories((prev) => [...prev, data[0]]);
        setNewCategory("");
        setSuccess(`Spiritual category "${data[0].name}" successfully created.`);
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id, name) {
    const catItem = categoriesWithCounts.find((c) => c.id === id);
    const assignedCount = catItem?.count || 0;
    const confirmMsg = assignedCount > 0
      ? `Warning: "${name}" has ${assignedCount} questions assigned to it. Are you sure you want to delete it?`
      : `Are you sure you want to remove the category "${name}"?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const { error: delErr } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (delErr) throw delErr;

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccess(`Category "${name}" removed successfully.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Calculate question count for each category
  const categoriesWithCounts = categories.map((cat) => {
    const count = questions.filter((q) =>
      q.categories?.some((c) => String(c.id) === String(cat.id))
    ).length;
    return { ...cat, count };
  });

  const filteredCategories = categoriesWithCounts.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
              የጥያቄ ዓይነቶች • Categorization
            </span>
          </div>
          <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
            Question Categories & Taxonomies
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Organize youth spiritual questions into theological, scriptural, and moral topics for structured clergy answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-800">
              {categories.length} Categories
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Category Section - Only visible if user has CATEGORIES_CREATE permission */}
      <Can permission="CATEGORIES_CREATE">
        <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-eotc text-base font-bold text-slate-900">
                Create New Category (አዲስ ምድብ ማከል)
              </h2>
              <p className="text-xs text-slate-500">
                Add a new spiritual category so reviewers can tag incoming youth inquiries.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. ቅዱሳት መጻሕፍት (Scripture), ሃይማኖተ አበው (Dogma), ሥነ-ምግባር (Christian Ethics)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={saving || !newCategory.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{saving ? "Adding..." : "Create Category"}</span>
            </button>
          </form>

          {/* Suggested Quick Presets */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              Quick Suggestions • የተለመዱ መንፈሳዊ ምድቦች:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPresets.map((preset) => {
                const isAlreadyAdded = categories.some(
                  (c) => c.name.toLowerCase() === preset.toLowerCase()
                );
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewCategory(preset)}
                    disabled={isAlreadyAdded}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isAlreadyAdded
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-amber-50/60 text-amber-900 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                    }`}
                    title={isAlreadyAdded ? "Already created" : `Click to use "${preset}"`}
                  >
                    {isAlreadyAdded ? "✓ " : "+ "}
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Can>

      {/* Search & Categories List */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif-eotc text-base font-bold text-slate-900">
              Configured Categories ({categories.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center flex flex-col items-center space-y-3">
            <EthiopianCross size={36} variant="gold" className="animate-spin" />
            <p className="text-xs text-slate-500">Loading spiritual categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <Tag className="w-8 h-8 mx-auto text-slate-300" />
            <p>No categories found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-amber-50/20 hover:border-amber-300 transition-all shadow-2xs group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    <h4 className="text-sm font-bold text-slate-900 font-serif-eotc">
                      {cat.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pl-4.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>{cat.count} questions assigned</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-400">ID: {cat.id}</span>
                  </div>
                </div>

                <Can permission="CATEGORIES_DELETE">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Can>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
