export function isLoggedIn() {
  return Boolean(localStorage.getItem("accessToken"));
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

export function isTrainer(userData) {
  return userData?.is_trainer === true;
}
