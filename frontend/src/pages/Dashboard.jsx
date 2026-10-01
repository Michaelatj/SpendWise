// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_spent: 0,
    monthly_budget: 0,
    remaining_budget: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get("/dashboard");
        const data = res.data?.data || res.data || {};
        setSummary(data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-10">Memuat data...</div>;

  const cards = [
    {
      title: "Total Pengeluaran",
      amount: summary.total_spent ?? summary.totalExpense ?? 0,
      color: "text-red-500",
    },
    {
      title: "Total Anggaran",
      amount: summary.monthly_budget ?? summary.totalBudget ?? 0,
      color: "text-blue-500",
    },
    {
      title: "Sisa Anggaran",
      amount: summary.remaining_budget ?? summary.remainingBudget ?? 0,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
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
              Rp {(card.amount ?? 0).toLocaleString("id-ID")}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tempat untuk tabel transaksi terbaru / chart nantinya */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8 h-64 flex items-center justify-center text-gray-400">
        Area Grafik atau Transaksi Terbaru
      </div>
    </div>
  );
};

export default Dashboard;

