export const getCKItem = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(window.localStorage.getItem("auth"));
  }
};

export const setCKItem = (value: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth", value);
  }
};

export const removeCKItem = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("auth");
  }
};
