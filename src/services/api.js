/* src/services/api.js */
/* NEW: improved API layer with caching, safe null handling, batching and optional fallback proxy. */

import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const CACHE = new Map();
const FALLBACK_PROXY = "https://corsproxy.io/?"; // used only if direct request fails (dev fallback)

/** helper: fetch with caching and fallback proxy if direct fails */
async function fetchJson(url, useProxyIfFail = true) {
  if (CACHE.has(url)) {
    return CACHE.get(url);
  }

  try {
    const res = await axios.get(url);
    // some endpoints return { meals: null } which indicates no results
    const payload = res.data;
    CACHE.set(url, payload);
    return payload;
  } catch (err) {
    console.warn(`[api] primary request failed for ${url}:`, err.message);
    if (!useProxyIfFail) throw err;

    // Try fallback proxy only as last resort (development convenience)
    try {
      const proxied = FALLBACK_PROXY + encodeURIComponent(url);
      const res2 = await axios.get(proxied);
      const payload = res2.data;
      CACHE.set(url, payload);
      return payload;
    } catch (err2) {
      console.error(`[api] fallback proxy failed for ${url}:`, err2.message);
      throw err2;
    }
  }
}

/** Search by name / ingredient / area combined */
export const getRecipesBySearch = async (query) => {
  if (!query) return [];

  try {
    const [byName, byIngredient, byArea] = await Promise.all([
      fetchJson(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`),
      fetchJson(`${BASE_URL}/filter.php?i=${encodeURIComponent(query)}`),
      fetchJson(`${BASE_URL}/filter.php?a=${encodeURIComponent(query)}`),
    ]);

    const mealsByName = (byName && byName.meals) || [];
    const mealsByIngredient = (byIngredient && byIngredient.meals) || [];
    const mealsByArea = (byArea && byArea.meals) || [];

    // combine and dedupe by idMeal
    const map = new Map();
    [...mealsByName, ...mealsByIngredient, ...mealsByArea].forEach((m) => {
      if (!m) return;
      map.set(m.idMeal, m);
    });

    return Array.from(map.values());
  } catch (err) {
    console.error("[api] getRecipesBySearch error:", err.message);
    return [];
  }
};

/** get single recipe by id */
export const getRecipeById = async (id) => {
  if (!id) return null;
  try {
    const res = await fetchJson(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
    return (res && res.meals && res.meals[0]) || null;
  } catch (err) {
    console.error("[api] getRecipeById error:", err.message);
    return null;
  }
};

/** Get all meals (A-Z) — NEW: batched to avoid rate limits and cached */
export const getAllMeals = async () => {
  // Use a single cached key so we don't refetch repeatedly
  const cacheKey = "__ALL_MEALS_AZ__";
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  // batch size to limit concurrent requests (helps avoid 429)
  const BATCH = 4;
  const results = [];

  for (let i = 0; i < letters.length; i += BATCH) {
    const batch = letters.slice(i, i + BATCH);
    // create requests for this batch
    const requests = batch.map((letter) =>
      fetchJson(`${BASE_URL}/search.php?f=${encodeURIComponent(letter)}`, /*useProxyIfFail*/ true)
        .then((data) => (data && data.meals) || [])
        .catch((err) => {
          console.warn(`[api] letter ${letter} failed:`, err.message);
          return [];
        })
    );

    // wait for this batch to finish
    const batchResults = await Promise.all(requests);
    batchResults.forEach((arr) => {
      if (Array.isArray(arr)) results.push(...arr);
    });

    // small pause between batches to be polite to the public API (optional)
    // await new Promise((r) => setTimeout(r, 150)); // uncomment to slow more
  }

  // final dedupe by idMeal
  const map = new Map();
  results.forEach((m) => {
    if (!m) return;
    map.set(m.idMeal, m);
  });

  const allMeals = Array.from(map.values());
  CACHE.set(cacheKey, allMeals);
  return allMeals;
};

/** get meals by category (safe) */
export const getMealsByCategory = async (category) => {
  if (!category) return [];
  try {
    const res = await fetchJson(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    return (res && res.meals) || [];
  } catch (err) {
    console.error("[api] getMealsByCategory error:", err.message);
    return [];
  }
};

/** get meals by area/cuisine (safe) */
export const getMealsByArea = async (area) => {
  if (!area) return [];
  try {
    const res = await fetchJson(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    return (res && res.meals) || [];
  } catch (err) {
    console.error("[api] getMealsByArea error:", err.message);
    return [];
  }
};

/** list categories (returns array of category names) */
export const listCategories = async () => {
  try {
    const res = await fetchJson(`${BASE_URL}/list.php?c=list`);
    return ((res && res.meals) || []).map((m) => m.strCategory).filter(Boolean);
  } catch (err) {
    console.error("[api] listCategories error:", err.message);
    return [];
  }
};

/** list areas/cuisines */
export const listAreas = async () => {
  try {
    const res = await fetchJson(`${BASE_URL}/list.php?a=list`);
    return ((res && res.meals) || []).map((m) => m.strArea).filter(Boolean);
  } catch (err) {
    console.error("[api] listAreas error:", err.message);
    return [];
  }
};
