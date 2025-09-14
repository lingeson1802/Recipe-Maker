/* src/components/Sidebar.jsx */
import { useState, useEffect } from "react";
import { PiX } from "react-icons/pi";
import { getAllMeals, listAreas, listCategories } from "../services/api";

export default function Sidebar({ isOpen, toggleSidebar, onSelect }) {
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [subgroups, setSubgroups] = useState({
    Vegetarian: ["Vegan", "Vegetarian"],
    "Non-Vegetarian": ["Goat", "Lamb", "Chicken", "Beef", "Pork", "Egg", "Seafood"],
    Breakfast: ["Breakfast"],
    "Lunch & Dinner": []
  });

  // Fetch categories & cuisines from API data (do not change design)
  useEffect(() => {
    const init = async () => {
      try {
        // Use getAllMeals to derive available categories (cached)
        const allMeals = await getAllMeals();
        const allCategories = Array.from(new Set(allMeals.map((m) => m.strCategory))).filter(Boolean);

        // Determine Lunch & Dinner as the rest (keeps your grouping idea)
        const used = Object.values(subgroups).flat();
        const lunchDinner = allCategories.filter((c) => !used.includes(c));
        setSubgroups((prev) => ({ ...prev, "Lunch & Dinner": lunchDinner }));

        // Get areas / cuisines
        const areas = Array.from(new Set(allMeals.map((m) => m.strArea))).filter(Boolean);
        setCuisines(areas);
      } catch (err) {
        console.error("[Sidebar] init error:", err.message);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (type, value) => {
    // safeguard
    if (!onSelect) {
      console.warn("[Sidebar] onSelect not provided");
      return;
    }

    if (activeSubcategory === value) {
      setActiveSubcategory(null);
      onSelect(type, null);
    } else {
      setActiveSubcategory(value);
      onSelect(type, value);
    }
  };

  return (
    <aside
      className={`z-50 fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-gray-300 p-6 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        className="mb-6 text-sm text-[#f10100] font-semibold"
        onClick={toggleSidebar}
      >
        <PiX size={28} />
      </button>

      <h3 className="font-bold text-lg text-gray-800 mb-2">Categories</h3>
      {Object.entries(subgroups).map(([groupName, subcats]) => (
        <div key={groupName} className="mb-4">
          <p className="font-semibold text-gray-700">{groupName}</p>
          <ul className="ml-2 space-y-1">
            {subcats.map((subcat) => (
              <li
                key={subcat}
                onClick={() => handleClick("category", subcat)}
                className={`cursor-pointer px-2 py-1 rounded-md transition-colors ${
                  activeSubcategory === subcat
                    ? "bg-indigo-100 text-indigo-800 font-semibold"
                    : "hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {subcat}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="font-bold text-lg text-gray-800 mt-6 mb-2">Cuisines</h3>
      <ul className="ml-2 space-y-1">
        {cuisines.map((cuisine) => (
          <li
            key={cuisine}
            onClick={() => handleClick("area", cuisine)}
            className={`cursor-pointer px-2 py-1 rounded-md transition-colors ${
              activeSubcategory === cuisine
                ? "bg-indigo-100 text-indigo-800 font-semibold"
                : "hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {cuisine}
          </li>
        ))}
      </ul>
    </aside>
  );
}
