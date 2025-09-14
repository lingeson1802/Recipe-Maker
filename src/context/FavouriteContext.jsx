import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Load from localStorage on first render
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.idMeal === meal.idMeal);
      if (exists) {
        return prev.filter((item) => item.idMeal !== meal.idMeal);
      } else {
        return [...prev, meal];
      }
    });
  };

  const isFavorite = (idMeal) =>
    favorites.some((meal) => meal.idMeal === idMeal);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
