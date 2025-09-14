import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Category({ onCategoryClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const scrollRef = useRef(null);

  const baseUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";

  const fetchCategories = async () => {
    try {
      const res = await fetch(baseUrl);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName) => {
    if (activeCategory === categoryName) {
      // Toggle OFF
      setActiveCategory(null);
      onCategoryClick(null); // Reset MealList
    } else {
      // Toggle ON
      setActiveCategory(categoryName);
      onCategoryClick(categoryName);
    }
  };

  return (
    <div className="p-6 relative">
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-gray-400 rounded-full p-4 z-10"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-hidden scroll-smooth py-3"
          >
            {categories.map((category) => (
              <div
                key={category.idCategory}
                className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleCategoryClick(category.strCategory)}
              >
                <div
                  className={`w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden transition-colors ${
                    activeCategory === category.strCategory
                      ? "border-3 border-[#f10100]"
                      : ""
                  }`}
                >
                  <img
                    src={category.strCategoryThumb}
                    alt={category.strCategory}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="font-semibold text-lg">{category.strCategory}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-gray-400 rounded-full p-4 z-10"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Category;
