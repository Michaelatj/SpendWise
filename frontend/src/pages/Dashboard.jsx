// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { motion } from "framer-motion";

const initialSummary = {
  total_expense: 0,
  total_budget: 0,
  all_time_remaining_budget: 0,
  recent_transactions: [],
};

function getErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    error.message ||
    "Gagal memuat data dashboard. Silakan coba lagi."
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Dashboard = () => {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get("/dashboard");
        const data = response.data?.data;

        if (
          !data ||
          !Array.isArray(data.recent_transactions) ||
          !Number.isFinite(Number(data.total_expense)) ||
          !Number.isFinite(Number(data.total_budget)) ||
          !Number.isFinite(Number(data.all_time_remaining_budget))
        ) {
          throw new Error("Format data dashboard dari server tidak valid.");
        }

        if (isActive) {
          setSummary(data);
          setError("");
        }
      } catch (requestError) {
        console.error(
          "Gagal mengambil data dashboard:",
          requestError.response?.data || requestError.message,
        );
        if (isActive) setError(getErrorMessage(requestError));
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const cards = [
    {
      title: "Total Pengeluaran",
      amount: summary.total_expense,
      color: "text-red-500",
    },
    {
      title: "Total Anggaran",
      amount: summary.total_budget,
      color: "text-blue-500",
    },
    {
      title: "Sisa Anggaran",
      amount: summary.all_time_remaining_budget,
      color: "text-green-500",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          SpendWise
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan seluruh pengeluaran dan anggaran Anda.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>
              {loading ? "Memuat..." : formatCurrency(card.amount)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaksi Terbaru
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Lima pengeluaran terakhir yang tercatat.
          </p>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            Memuat transaksi...
          </p>
        ) : summary.recent_transactions.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            Belum ada transaksi pengeluaran.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {summary.recent_transactions.slice(0, 5).map((transaction) => (
              <li
                key={transaction.id}
                className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {transaction.description || transaction.category_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {transaction.category_name || "Tanpa kategori"}
                    {transaction.expense_date
                      ? ` · ${formatDate(transaction.expense_date)}`
                      : ""}
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-red-600">
                  {formatCurrency(transaction.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
