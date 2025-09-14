/* src/App.jsx */
/* NEW: App now owns sidebar state and selectedFilter; passes handler to Sidebar and LandingPage */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Detail from "./pages/Detail";
import FavoritesPage from "./pages/FavoritesPage";
import Saved from "./pages/Saved";
import Footer from "./components/Footer";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({ type: null, value: null }); /* NEW */

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSidebarSelect = (type, value) => {
    setSelectedFilter({ type: type || null, value: value || null });
    setIsOpen(false);
  };

  return (
    <Router>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        onSelect={handleSidebarSelect} 
        
      />

      <Routes>
        <Route
          path="/"
          element={<LandingPage selectedFilter={selectedFilter} />}
        />
        <Route path="/recipe/:id" element={<Detail />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
