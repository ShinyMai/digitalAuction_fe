export const removeVietnameseAccents = (str: string): string => {
  if (!str) return "";

  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

export const searchWithoutAccents = (searchTerm: string, targetText: string): boolean => {
  if (!searchTerm || !targetText) return false;

  const normalizedSearchTerm = removeVietnameseAccents(searchTerm);
  const normalizedTargetText = removeVietnameseAccents(targetText);

  return normalizedTargetText.includes(normalizedSearchTerm);
};

export const filterArrayWithoutAccents = <T>(
  items: T[],
  searchTerm: string,
  searchField: keyof T
): T[] => {
  if (!searchTerm) return items;

  return items.filter((item) => {
    const fieldValue = item[searchField];
    if (typeof fieldValue === "string") {
      return searchWithoutAccents(searchTerm, fieldValue);
    }
    return false;
  });
};
