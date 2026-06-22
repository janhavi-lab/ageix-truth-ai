const REMEMBER_KEY = "ageix-remember-me";

export function getRememberMe(): boolean {
  return localStorage.getItem(REMEMBER_KEY) !== "false";
}

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
}
