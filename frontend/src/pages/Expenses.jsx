import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import apiClient from "../api/client";

const emptyForm = {
  category_id: "",
  description: "",
  amount: "",
  payment_method: "",
  expense_date: new Date().toISOString().slice(0, 10),
};

function getErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    "Terjadi kesalahan. Silakan coba lagi."
  );
}

async function fetchList(endpoint) {
  try {
    const response = await apiClient.get(endpoint);
    return {
      data: Array.isArray(response.data?.data) ? response.data.data : [],
      error: null,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { data: [], error: null };
    }

    console.error("Fetch API Error:", error.response?.data || error.message);
    return { data: [], error };
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadExpenseData = () =>
    Promise.all([fetchList("/expenses"), fetchList("/categories")]);

  const loadCategories = async () => {
    const result = await fetchList("/categories");
    setCategories(result.data);
    if (result.error) setError(getErrorMessage(result.error));
    return result.data;
  };

  const fetchData = async () => {
    const [expenseResult, categoryResult] = await loadExpenseData();
    setExpenses(expenseResult.data);
    setCategories(categoryResult.data);
    const requestError = expenseResult.error || categoryResult.error;
    setError(requestError ? getErrorMessage(requestError) : "");
    setLoading(false);
  };

  useEffect(() => {
    let isActive = true;
    loadExpenseData()
      .then(([expenseResult, categoryResult]) => {
        if (!isActive) return;
        setExpenses(expenseResult.data);
        setCategories(categoryResult.data);
        const requestError = expenseResult.error || categoryResult.error;
        setError(requestError ? getErrorMessage(requestError) : "");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const openCreateForm = () => {
    setEditingExpense(null);
    setForm({
      ...emptyForm,
      expense_date: new Date().toISOString().slice(0, 10),
    });
    setIsFormOpen(true);
    loadCategories();
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setForm({
      category_id: String(expense.category_id),
      description: expense.description,
      amount: String(expense.amount),
      payment_method: expense.payment_method,
      expense_date: expense.expense_date,
    });
    setIsFormOpen(true);
    loadCategories();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      amount: Number(form.amount),
    };

    try {
      if (editingExpense) {
        await apiClient.put(`/expenses/${editingExpense.id}`, payload);
      } else {
        await apiClient.post("/expenses", payload);
      }
      closeForm();
      await fetchData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Hapus pengeluaran "${expense.description}"?`)) return;

    setError("");
    try {
      await apiClient.delete(`/expenses/${expense.id}`);
      await fetchData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            SpendWise
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Pengeluaran</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau semua transaksi pengeluaran.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus size={18} />
          Tambah Pengeluaran
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

      {categories.length === 0 && !loading && !error && (
        <p className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Belum ada kategori. Tambahkan kategori terlebih dahulu agar
          pengeluaran dapat dicatat.
        </p>
      )}

      <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            Memuat data pengeluaran...
          </p>
        ) : expenses.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            Belum ada data pengeluaran.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Deskripsi</th>
                  <th className="px-5 py-3 font-semibold">Kategori</th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Pembayaran</th>
                  <th className="px-5 py-3 text-right font-semibold">Jumlah</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {expense.category_name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {expense.payment_method}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(expense)}
                          aria-label={`Edit ${expense.description}`}
                          title="Edit pengeluaran"
                          className="rounded p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(expense)}
                          aria-label={`Hapus ${expense.description}`}
                          title="Hapus pengeluaran"
                          className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-form-title"
            className="my-auto w-full max-w-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2
                id="expense-form-title"
                className="text-lg font-bold text-gray-900"
              >
                {editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
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
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {categories.length === 0 && (
                <p className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Kategori belum tersedia. Form tetap bisa dibuka, tetapi
                  pengeluaran belum dapat disimpan sampai kategori berhasil
                  dimuat.
                </p>
              )}
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi
                <input
                  required
                  maxLength={255}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="Contoh: Makan siang"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kategori
                  <select
                    required
                    value={form.category_id}
                    onChange={(event) =>
                      setForm({ ...form, category_id: event.target.value })
                    }
                    className="mt-1.5 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="" disabled>
                      Pilih kategori
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah (Rp)
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                    placeholder="0"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Metode Pembayaran
                  <input
                    required
                    maxLength={50}
                    value={form.payment_method}
                    onChange={(event) =>
                      setForm({ ...form, payment_method: event.target.value })
                    }
                    className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                    placeholder="Contoh: Tunai, Debit Card"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal
                  <input
                    required
                    type="date"
                    value={form.expense_date}
                    onChange={(event) =>
                      setForm({ ...form, expense_date: event.target.value })
                    }
                    className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </label>
              </div>
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
                  disabled={saving || categories.length === 0}
                  className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : categories.length === 0
                      ? "Kategori belum tersedia"
                      : editingExpense
                        ? "Simpan Perubahan"
                        : "Simpan Pengeluaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Expenses;
