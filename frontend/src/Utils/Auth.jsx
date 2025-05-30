export function isLoggedIn() {
  return Boolean(localStorage.getItem("accessToken"));
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
