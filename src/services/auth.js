import config from '../config';

class AuthService {
  setToken(token) {
    localStorage.setItem(config.AUTH_TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(config.AUTH_TOKEN_KEY);
  }

  setUser(user) {
    localStorage.setItem(config.AUTH_USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(config.AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(config.AUTH_TOKEN_KEY);
    localStorage.removeItem(config.AUTH_USER_KEY);
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();