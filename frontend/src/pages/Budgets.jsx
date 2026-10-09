import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Wallet, X } from "lucide-react";
import apiClient from "../api/client";

function getErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    "Terjadi kesalahan. Silakan coba lagi."
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isActive = true;

    Promise.all([apiClient.get("/budgets"), apiClient.get("/categories")])
      .then(([budgetResponse, categoryResponse]) => {
        const budgetData = budgetResponse.data?.data;
        const categoryData = categoryResponse.data?.data;
        if (!Array.isArray(budgetData) || !Array.isArray(categoryData)) {
          throw new Error(
            "Format data anggaran atau kategori dari server tidak valid.",
          );
        }

        if (isActive) {
          setBudgets(budgetData);
          setCategories(categoryData);
        }
      })
      .catch((requestError) => {
        console.error(
          "Gagal mengambil data anggaran:",
          requestError.response?.data || requestError.message,
        );
        if (isActive) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const refreshBudgets = async () => {
    const response = await apiClient.get("/budgets");
    if (!Array.isArray(response.data?.data)) {
      throw new Error("Format data anggaran dari server tidak valid.");
    }
    setBudgets(response.data.data);
  };

  const openCreateForm = () => {
    setEditingBudget(null);
    setCategoryId("");
    setAmount("");
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (budget) => {
    setEditingBudget(budget);
    setCategoryId(String(budget.category_id));
    setAmount(String(budget.amount));
    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categoryId) {
      setError("Pilih kategori untuk anggaran ini.");
      return;
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Nominal anggaran harus lebih besar dari nol.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        category_id: Number(categoryId),
        amount: Number(amount),
      };
      if (editingBudget) {
        await apiClient.put(`/budgets/${editingBudget.id}`, payload);
      } else {
        await apiClient.post("/budgets", payload);
      }
      closeForm();
      await refreshBudgets();
    } catch (requestError) {
      console.error(
        editingBudget ? "Update Budget Error:" : "Create Budget Error:",
        requestError.response?.data || requestError.message,
      );
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (budget) => {
    if (!window.confirm(`Hapus anggaran kategori "${budget.category_name}"?`))
      return;

    setDeletingId(budget.id);
    setError("");
    try {
      await apiClient.delete(`/budgets/${budget.id}`);
      await refreshBudgets();
    } catch (requestError) {
      console.error(
        "Delete Budget Error:",
        requestError.response?.data || requestError.message,
      );
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  const hasAvailableCategory = categories.some(
    (category) =>
      !budgets.some(
        (budget) => Number(budget.category_id) === Number(category.id),
      ),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            SpendWise
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Anggaran</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau batas dan penggunaan anggaran untuk setiap kategori.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          disabled={loading || !hasAvailableCategory}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Tambah Anggaran
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

      {loading ? (
        <div className="border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
          Memuat anggaran...
        </div>
      ) : budgets.length === 0 ? (
        <div className="border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <Wallet className="mx-auto text-emerald-700" size={30} />
          <p className="mt-3 text-sm font-medium text-gray-900">
            Belum ada anggaran
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan batas pengeluaran untuk kategori yang ingin dipantau.
          </p>
          {categories.length === 0 && (
            <p className="mt-2 text-sm text-amber-700">
              Buat kategori terlebih dahulu sebelum menambahkan anggaran.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => {
            const amountValue = Number(budget.amount) || 0;
            const spentValue = Number(budget.total_spent) || 0;
            const remaining = amountValue - spentValue;
            const percentage =
              amountValue > 0 ? (spentValue / amountValue) * 100 : 0;
            const progressColor =
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-yellow-500"
                  : "bg-green-500";

            return (
              <article
                key={budget.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {budget.category_name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Batas anggaran</p>
                    <p className="mt-0.5 text-xl font-bold text-gray-900">
                      {formatCurrency(amountValue)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(budget)}
                      aria-label={`Edit anggaran ${budget.category_name}`}
                      title="Edit anggaran"
                      className="rounded p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(budget)}
                      disabled={deletingId === budget.id}
                      aria-label={`Hapus anggaran ${budget.category_name}`}
                      title="Hapus anggaran"
                      className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Terpakai bulan ini</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatCurrency(spentValue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">Sisa</p>
                    <p
                      className={`mt-1 font-semibold ${
                        remaining < 0 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-gray-500">
                    <span>Penggunaan anggaran</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`Penggunaan anggaran ${budget.category_name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.min(100, Math.round(percentage))}
                    className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                  >
                    <div
                      className={`h-full rounded-full transition-all ${progressColor}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-form-title"
            className="my-auto w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2
                id="budget-form-title"
                className="text-lg font-bold text-gray-900"
              >
                {editingBudget ? "Edit Anggaran" : "Tambah Anggaran"}
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
                Kategori
                <select
                  required
                  autoFocus
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="">Pilih kategori</option>
                  {categories
                    .filter(
                      (category) =>
                        !budgets.some(
                          (budget) =>
                            Number(budget.category_id) ===
                              Number(category.id) &&
                            budget.id !== editingBudget?.id,
                        ),
                    )
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Nominal anggaran (Rp)
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="Contoh: 1000000"
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
                    : editingBudget
                      ? "Simpan Perubahan"
                      : "Simpan Anggaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Budgets;
