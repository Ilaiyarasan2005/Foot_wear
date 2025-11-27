// services/adminAuthService.ts
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { localStorageService } from './localStorageService';
import { LOCAL_STORAGE_KEYS } from '../types';

export const adminAuthService = {
  login: (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorageService.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, true);
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorageService.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
  },

  isAuthenticated: (): boolean => {
    return localStorageService.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === true;
  },
};