export const STORAGE_KEYS = {
  loginState: 'IS_LOGGED_IN',
  userCredentials: 'USER_CREDENTIALS',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
