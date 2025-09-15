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


  // Helper function to generate pagination buttons
const getPaginationButtons = (totalPages, currentPage, delta = 2) => {
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

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
      {/* <div className="flex flex-wrap justify-center mt-8 gap-2">
        {Array.from(
          { length: Math.ceil(meals.length / mealsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-[#2f8954] text-white"
                  : "bg-[#c2c2c2] text-white hover:bg-[#48b85c]"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div> */}
      {/* Pagination */}
<div className="flex flex-wrap justify-center mt-8 gap-2">
  {getPaginationButtons(Math.ceil(meals.length / mealsPerPage), currentPage).map((item, index) => {
    const isActive = item === currentPage;
    const isEllipsis = item === "...";

    return (
      <button
        key={index}
        onClick={() => !isEllipsis && setCurrentPage(item)}
        disabled={isEllipsis}
        className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
          isEllipsis
            ? "cursor-default text-gray-500"
            : isActive
            ? "bg-[#1f6c2d] text-white"
            : "bg-[#C2C2C2] text-white hover:bg-[#62f062]"
        }`}
      >
        {item}
      </button>
    );
  })}
</div>

    </div>
  );
}
