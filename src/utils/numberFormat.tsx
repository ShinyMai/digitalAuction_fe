export const formatNumber = (
  num: number | string | undefined
): string => {
  if (!num) return "Chưa có";
  const number =
    typeof num === "string"
      ? parseFloat(num.replace(/[^0-9.-]+/g, ""))
      : num;
  if (isNaN(number)) return "Chưa có";
  return number.toLocaleString("vi-VN");
};
