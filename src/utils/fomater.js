export const formatter = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const numberFormatter = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};
