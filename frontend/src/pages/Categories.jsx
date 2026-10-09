import { useEffect, useState } from "react";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import apiClient from "../api/client";

function getErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    "Terjadi kesalahan. Silakan coba lagi."
  );
}

async function fetchCategories() {
  try {
    const response = await apiClient.get("/categories");
    return {
      data: Array.isArray(response.data?.data) ? response.data.data : [],
      error: null,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { data: [], error: null };
    }

    console.error(
      "Fetch Categories API Error:",
      error.response?.data || error.message,
    );
    return { data: [], error };
  }
}

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const refreshCategories = async () => {
    const result = await fetchCategories();
    setCategories(result.data);
    setError(result.error ? getErrorMessage(result.error) : "");
    setLoading(false);
    return result;
  };

  useEffect(() => {
    let isActive = true;

    fetchCategories()
      .then((result) => {
        if (!isActive) return;
        setCategories(result.data);
        setError(result.error ? getErrorMessage(result.error) : "");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const openCreateForm = () => {
    setEditingCategory(null);
    setName("");
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const categoryName = name.trim();
    if (!categoryName) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory.id}`, {
          name: categoryName,
        });
      } else {
        await apiClient.post("/categories", { name: categoryName });
      }
      closeForm();
      await refreshCategories();
    } catch (requestError) {
      console.error(
        editingCategory ? "Update Category Error:" : "Post Error:",
        requestError.response?.data || requestError.message,
      );
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;

    setDeletingId(category.id);
    setError("");
    try {
      await apiClient.delete(`/categories/${category.id}`);
      await refreshCategories();
    } catch (requestError) {
      console.error(
        "Delete Category API Error:",
        requestError.response?.data || requestError.message,
      );
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            SpendWise
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Kategori</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola kategori yang tersedia untuk transaksi pengeluaran.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Tutup pesan error"
            className="shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            Memuat kategori...
          </p>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Tag className="mx-auto text-emerald-700" size={28} />
            <p className="mt-3 text-sm font-medium text-gray-900">
              Belum ada kategori
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tambahkan kategori agar dapat dipilih saat mencatat pengeluaran.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama kategori</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-3 font-medium text-gray-900">
                        <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <Tag size={17} />
                        </span>
                        {category.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          aria-label={`Edit ${category.name}`}
                          title="Edit kategori"
                          className="rounded p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          aria-label={`Hapus ${category.name}`}
                          title="Hapus kategori"
                          className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            className="my-auto w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2
                id="category-form-title"
                className="text-lg font-bold text-gray-900"
              >
                {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Tutup form"
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <p
                  role="alert"
                  className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {error}
                </p>
              )}
              <label className="block text-sm font-medium text-gray-700">
                Nama kategori
                <input
                  required
                  autoFocus
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="Contoh: Makanan"
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingCategory
                      ? "Simpan Perubahan"
                      : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Categories;
