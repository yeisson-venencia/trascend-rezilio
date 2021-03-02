export default class store {
  static get(key) {
    if (
      localStorage.getItem(key) !== null &&
      localStorage.getItem(key) !== undefined
    ) {
      return localStorage.getItem(key);
    }
    return null;
  }

  static set(key, value) {
    return localStorage.setItem(key, value);
  }

  static remove(key) {
    return localStorage.removeItem(key);
  }

  static encrypt(key, value) {
    return this.set(key, window.btoa(value));
  }

  static decrypt(key) {
    if (this.get(key) !== null) {
      return window.atob(this.get(key));
    }
  }
}
