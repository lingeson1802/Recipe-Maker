/* src/pages/LandingPage.jsx */
import { useState, useEffect, useRef } from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import MealList from "../components/MealList";
import { getAllMeals, getRecipesBySearch, getMealsByCategory, getMealsByArea } from "../services/api";
import { PiCookingPotBold } from "react-icons/pi";

export default function LandingPage({ selectedFilter }) { /* NEW prop */
  const [meals, setMeals] = useState([]);
  const [heading, setHeading] = useState("");
  const searchTimeout = useRef(null);

  // Load all meals initially (cached by api layer)
  useEffect(() => {
    const load = async () => {
      const data = await getAllMeals();
      setMeals(data);
      setHeading("All Recipes");
    };
    load();
  }, []);

  // React to sidebar selection changes
  useEffect(() => {
    const fetchForFilter = async () => {
      if (!selectedFilter || !selectedFilter.value) {
        // no filter => show all
        const data = await getAllMeals();
        setMeals(data);
        setHeading("All Recipes");
        return;
      }

      const { type, value } = selectedFilter;
      if (type === "category") {
        const data = await getMealsByCategory(value);
        setMeals(data);
        setHeading(`Category: "${value}"`);
      } else if (type === "area") {
        const data = await getMealsByArea(value);
        setMeals(data);
        setHeading(`Cuisine: "${value}"`);
      } else {
        // fallback: fetch all
        const data = await getAllMeals();
        setMeals(data);
        setHeading("All Recipes");
      }
    };

    fetchForFilter();
  }, [selectedFilter]);

  // Search (debounced)
  const handleSearch = (term) => {
    clearTimeout(searchTimeout.current);
    if (!term) return;

    searchTimeout.current = setTimeout(async () => {
      const data = await getRecipesBySearch(term);
      setMeals(data);
      setHeading(`Search results for "${term}"`);
    }, 400);
  };

  // Category carousel click (unchanged design)
  const handleCategoryClick = async (category) => {
    if (!category) {
      const d = await getAllMeals();
      setMeals(d);
      setHeading("All Recipes");
      return;
    }
    const data = await getMealsByCategory(category);
    setMeals(data);
    setHeading(`Category: "${category}"`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8F4] via-[#ED8A42]/20 to-[#48b85c]/20 flex flex-col">
      {/* NOTE: Sidebar removed from here — App renders a single Sidebar instance. */}

      {/* Hero Section */}
      <section>
        <Hero onSearch={handleSearch} />
      </section>

      {/* Category Section */}
      <section className="bg-[#FFF8F4] rounded-xl mt-12">
        <Category onCategoryClick={handleCategoryClick} />
      </section>

      {/* MealList */}
      <section className="mt-8 px-4">
        {heading && (
          <h2 className="text-2xl font-bold text-[#48b85c] mb-6 text-center flex items-center justify-center gap-3">
            <PiCookingPotBold className="text-[#ED8A42] text-3xl" /> {heading}
          </h2>
        )}
        <MealList meals={meals} />
      </section>
    </main>
  );
}
