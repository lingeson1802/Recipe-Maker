import { useEffect, useState } from "react";
import MealCard from "../components/MealCard";

export default function Saved() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const storedSaved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    setSaved(storedSaved);
  }, []);

  if (!saved.length) {
    return (
      <p className="text-center text-lg py-20 text-gray-600">
        No saved recipes yet.
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8F4] via-[#ED8A42]/10 to-[#48b85c]/10 px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#ED8A42]">
        Saved Recipes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {saved.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} isLiked={false} toggleLike={() => {}} />
        ))}
      </div>
    </main>
  );
}
