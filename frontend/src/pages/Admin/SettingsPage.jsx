import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import EthiopianCross from "../../components/ui/EthiopianCross";
import { Tag, Plus, CheckCircle2, Sliders } from "lucide-react";

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategory.trim() }])
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setCategories([...categories, ...data]);
      setNewCategory("");
      setSuccess(`Spiritual category "${data[0]?.name}" successfully added!`);
      setTimeout(() => setSuccess(""), 4000);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
            ቅንብሮች • Configuration
          </span>
        </div>
        <h2 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
          System & Spiritual Taxonomy Settings
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Manage theological topics, question classifications, and system preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-eotc text-lg font-bold text-slate-900">
              Youth Question Categories (የጥያቄ ዓይነቶች)
            </h3>
            <p className="text-xs text-slate-500">
              Define the spiritual, moral, and liturgical topics used to route questions to clergy.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-3.5 text-xs font-medium text-rose-800 border border-rose-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. ቅዱሳት መጻሕፍት (Scripture), ሃይማኖተ አበው (Dogma), ሕይወተ ወጣት (Youth Ethics)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{saving ? "Adding..." : "Add Category"}</span>
          </button>
        </form>

        {/* Category List */}
        {loading ? (
          <div className="p-10 text-center flex flex-col items-center space-y-2">
            <EthiopianCross size={32} variant="gold" className="animate-spin" />
            <p className="text-xs text-slate-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No categories created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-amber-900/10 bg-amber-50/20 hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ID: {cat.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}