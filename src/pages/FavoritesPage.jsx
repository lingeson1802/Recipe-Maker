import MealCard from "../components/MealCard";
import { useFavorites } from "../context/FavouriteContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <p className="text-center text-lg py-20 text-gray-600">
        No favorites yet. ❤️ Like some meals to save them here!
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#ED8A42] text-center">
        Your Favorite Recipes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} />
        ))}
      </div>
    </div>
  );
}
