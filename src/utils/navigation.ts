/**
 * Navigation utility for hash-based routing
 */

export const navigate = (hash: string) => {
  window.location.href = hash;
};

export const navigateToLogin = () => {
  navigate('#loginLobby');
};

export const navigateToRegistration = () => {
  navigate('#registration');
};
