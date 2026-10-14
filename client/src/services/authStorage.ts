export const AUTH_TOKEN_KEY = 'taskduty-auth-token';
export const AUTH_EMAIL_KEY = 'taskduty-auth-email';

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);
