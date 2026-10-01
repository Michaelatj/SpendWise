// src/components/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Tags, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const Layout = () => {
  const menus = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Expenses", path: "/expenses", icon: <Receipt size={20} /> },
    { name: "Categories", path: "/categories", icon: <Tags size={20} /> },
    { name: "Budgets", path: "/budgets", icon: <Wallet size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">SpendWise</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              {menu.icon}
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold">Overview</h2>
        </header>

        {/* Page Content dengan Animasi Framer Motion */}
        <motion.div
          className="flex-1 overflow-auto p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
