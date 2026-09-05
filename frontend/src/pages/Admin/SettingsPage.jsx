import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategory.trim() }])
      .select();

    if (error) {
      setError(error.message);
    } else if (data) {
      setCategories([...categories, ...data]);
      setNewCategory("");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">
          Manage system configurations and taxonomies.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Question Categories
        </h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="e.g. Technical, General, Support"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Category List */}
        {loading ? (
          <p className="text-sm text-slate-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-400">No categories created yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between p-3 text-sm font-medium text-slate-700"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-slate-400">
                  ID: {cat.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}