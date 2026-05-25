import { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddTasks from "./pages/AddTasks";
import ListTasks from "./pages/ListTasks";
import DeleteHistory from "./pages/DeleteHistory";
import DataCenter from "./pages/DataCenter";
import { ThemeProvider } from "./context/ThemeContext";
import { CategoryProvider } from "./context/CategoryContext";
import ShortcutsHUD from "./components/ShortcutsHUD";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import "./index.css";

function App() {
  const [hudVisible, setHudVisible] = useState(false);
  const toggleHUD = useCallback(() => setHudVisible((v) => !v), []);

  return (
    <ThemeProvider>
      <CategoryProvider>
        <ShortcutsHUD visible={hudVisible} />
        <Router>
          <AppInner toggleHUD={toggleHUD} hudVisible={hudVisible} />
        </Router>
      </CategoryProvider>
    </ThemeProvider>
  );
}

function AppInner({ toggleHUD, hudVisible }) {
  useKeyboardShortcuts(toggleHUD, hudVisible);

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-tasks" element={<AddTasks />} />
        <Route path="/list-tasks" element={<ListTasks />} />
        <Route path="/delete-history" element={<DeleteHistory />} />
        <Route path="/data-center" element={<DataCenter />} />
      </Routes>
    </>
  );
}

export default App;