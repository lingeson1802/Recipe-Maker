import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavouriteContext";



export default function MealCard({ meal }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-md hover:shadow-xl transition relative p-2">
      <Link to={`/recipe/${meal.idMeal}`}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-52 object-cover rounded-t-xl"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{meal.strMeal}</h3>
        {meal.strArea && (
          <p className="text-sm text-[#48b85c] font-medium">
            Cuisine: {meal.strArea}
          </p>
        )}
        {meal.strCategory && (
          <p className="text-sm text-[#ED8A42] font-medium">
            Category: {meal.strCategory}
          </p>
        )}
      </div>
      <button
        onClick={() => toggleFavorite(meal)}
        className="absolute top-4 right-4 text-[#f10100] text-xl h-10 w-10 rounded-full bg-white/50 border backdrop-blur-md flex items-center justify-center"
      >
        {isFavorite(meal.idMeal) ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
}
