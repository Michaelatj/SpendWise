// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";

// Buat komponen placeholder sementara untuk halaman lain
const Expenses = () => <div>Halaman Expense Management</div>;
const Categories = () => <div>Halaman Category Management</div>;
const Budgets = () => <div>Halaman Budget Management</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="budgets" element={<Budgets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
