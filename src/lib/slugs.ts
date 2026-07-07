export function categoryToSlug(category: string) {
  return encodeURIComponent(
    category
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function findCategoryBySlug(categories: string[], slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  return categories.find((category) => categoryToSlug(category) === decodedSlug);
}
