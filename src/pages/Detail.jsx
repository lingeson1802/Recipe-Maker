import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaUtensils,
  FaStar,
} from "react-icons/fa";
import { getRecipeById } from "../services/api"; // ✅ Centralized API call

export default function Detail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      const fetchedMeal = await getRecipeById(id);
      setMeal(fetchedMeal);

      // Check local storage
      const favs = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsLiked(favs.some((fav) => fav.idMeal === fetchedMeal.idMeal));

      const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
      setIsSaved(saved.some((rec) => rec.idMeal === fetchedMeal.idMeal));
    };
    fetchMeal();
  }, [id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const updated = isLiked
      ? favs.filter((f) => f.idMeal !== meal.idMeal)
      : [...favs, meal];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsLiked(!isLiked);
  };

  const toggleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const updated = isSaved
      ? saved.filter((s) => s.idMeal !== meal.idMeal)
      : [...saved, meal];
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  if (!meal) return <p className="text-center py-12">Loading...</p>;

  // ✅ Generate ingredients dynamically
  const getIngredients = () => {
    let result = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        result.push({ ingredient, measure });
      }
    }
    return result;
  };

  // ✅ Split instructions into bullet points
  const getInstructions = () => {
    return meal.strInstructions
      .split(/\r?\n/)
      .filter((step) => step.trim().length > 5);
  };

  return (
    <main className="px-6 py-12 bg-[#fefdfc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-[#48b85c] flex items-center gap-2 mb-6">
          <FaArrowLeft /> Back
        </Link>

        <div className="bg-white shadow-md rounded-2xl overflow-hidden px-6 py-4">
          <div className="grid md:grid-cols-2">
            {/* ✅ Meal Image */}
            <div className="relative rounded-[30px] bg-white shadow-2xl overflow-hidden">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-full object-cover max-h-[400px]"
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-[#f10100] shadow-lg text-3xl"
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* ✅ Right Side Info */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#f10100] mb-2">
                  {meal.strMeal}
                </h1>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap text-sm mb-4">
                  <span className="bg-[#ED8A42]/20 text-[#ED8A42] px-3 py-1 rounded-full">
                    <FaUtensils className="inline-block mr-1" />
                    {meal.strCategory}
                  </span>
                  <span className="bg-[#48b85c]/20 text-[#48b85c] px-3 py-1 rounded-full">
                    <FaClock className="inline-block mr-1" />
                    45 min
                  </span>
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                    <FaStar className="inline-block mr-1" />
                    Medium
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {meal.strArea}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  A healthy and flavorful {meal.strCategory} from {meal.strArea}.
                </p>

                {/* ✅ Save Button */}
                <button
                  onClick={toggleSave}
                  className={`flex items-center gap-2 text-sm font-medium mb-4 ${
                    isSaved ? "text-[#f10100]" : "text-gray-500"
                  }`}
                >
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  {isSaved ? "Saved" : "Save Recipe"}
                </button>

                {/* ✅ CTA Links */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {meal.strYoutube && (
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#ED8A42] text-white rounded-lg hover:bg-[#f10100]"
                    >
                      🎥 Watch Recipe
                    </a>
                  )}
                  {meal.strSource && (
                    <a
                      href={meal.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#48b85c] text-white rounded-lg hover:bg-[#2d8844]"
                    >
                      📖 Full Recipe
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Ingredients with images */}
          <div className="p-6 ">
            <h3 className="text-xl font-semibold text-[#ED8A42] mb-4">Ingredients</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getIngredients().map(({ ingredient, measure }, index) => (
                <div
                  key={index}
                  className="bg-white border p-2 rounded-xl text-center shadow-sm"
                >
                  <img
                    src={`https://www.themealdb.com/images/ingredients/${ingredient}.png`}
                    alt={ingredient}
                    className="w-12 h-12 object-contain mx-auto mb-2"
                  />
                  <p className="font-semibold text-gray-700">{ingredient}</p>
                  <p className="text-sm text-gray-500">{measure}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Instructions as bullet points */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#ED8A42] mb-4">
              🧑‍🍳 Step-by-step preparation instruction:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 leading-relaxed">
              {getInstructions().map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
