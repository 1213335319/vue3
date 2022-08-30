import Cookies from "js-cookie";

interface Storage {
  set(key: string, value: any): void;
  get<T = string>(key: string): T | undefined;
  remove(key: string): void;
}

interface CookiesStorage extends Storage {
  set(key: string, value: any, options?: any): void;
  get<T = string>(key: string): T | undefined;
  remove(key: string, options?: any): void;
}

/**
 * 本地存储
 */
export const local: Storage = {
  set(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value) || "");
  },
  get<T = string>(key: string): T | undefined {
    const str = localStorage.getItem(key);
    if (str === undefined || str === null) return undefined;
    try {
      const value = JSON.parse(str);
      return value === undefined || value === null ? undefined : (value as T);
    } catch {
      return undefined;
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

/**
 * Cookie存储
 */
export const cookies: CookiesStorage = {
  set(key: string, value: any, options?): void {
    Cookies.set(key, JSON.stringify(value) || "", options);
  },
  get<T = string>(key: string): T | undefined {
    const str = Cookies.get(key);
    if (str === undefined || str === null) return undefined;
    try {
      const value = JSON.parse(str);
      return value === undefined || value === null ? undefined : (value as T);
    } catch {
      return undefined;
    }
  },
  remove(key: string, options?): void {
    Cookies.remove(key, options);
  },
};
