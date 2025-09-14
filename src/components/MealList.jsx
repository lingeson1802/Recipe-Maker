import React, { useState, useEffect } from "react";
import MealCard from "./MealCard";
import { PiCookingPotBold } from "react-icons/pi";

export default function MealList({ meals }) {
  const [likes, setLikes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 12;

  // Reset page to 1 whenever meals prop changes
  useEffect(() => {
    setCurrentPage(1);
  }, [meals]);

  const toggleLike = (id) => {
    setLikes((prev) =>
      prev.includes(id)
        ? prev.filter((mealId) => mealId !== id)
        : [...prev, id]
    );
  };

  if (!meals || meals.length === 0)
    return <p className="text-center text-lg py-20">No meals found.</p>;

  // Pagination logic
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentMeals.map((meal) => (
          <MealCard
            key={meal.idMeal}
            meal={meal}
            isLiked={likes.includes(meal.idMeal)}
            toggleLike={toggleLike}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-3">
        {Array.from(
          { length: Math.ceil(meals.length / mealsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-lg font-semibold ${
                currentPage === index + 1
                  ? "bg-[#48b85c] text-white"
                  : "bg-[#ED8A42] text-white hover:bg-[#f10100]"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
