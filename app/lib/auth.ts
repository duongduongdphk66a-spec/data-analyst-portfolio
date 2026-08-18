export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export type AdminAccounts = Record<string, string>;

// Default password for both is 'admin123'
const DEFAULT_ACCOUNTS: AdminAccounts = {
  'admin': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'collaborator': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
};

const ACCOUNTS_KEY = 'portfolio_admin_accounts_v2';
const SESSION_KEY = 'portfolio_admin_authenticated';
const SESSION_USER_KEY = 'portfolio_admin_username';

export function getStoredAccounts(): AdminAccounts {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (stored) {
    try {
      // Merge with default accounts to ensure both always exist
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_ACCOUNTS, ...parsed };
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  }
  return DEFAULT_ACCOUNTS;
}

export function setStoredAccounts(accounts: AdminAccounts): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

export async function verifyCredentials(username: string, inputPassword: string): Promise<boolean> {
  const accounts = getStoredAccounts();
  if (!accounts[username]) return false;
  
  const inputHash = await sha256(inputPassword);
  return inputHash === accounts[username];
}

export async function changePassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const isValid = await verifyCredentials(username, currentPassword);
  if (!isValid) {
    return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
  }
  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự.' };
  }
  const newHash = await sha256(newPassword);
  const accounts = getStoredAccounts();
  accounts[username] = newHash;
  setStoredAccounts(accounts);
  return { success: true, message: 'Đổi mật khẩu thành công!' };
}

export function isSessionAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function getSessionUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_USER_KEY);
}

export function setAdminSession(status: boolean, username?: string): void {
  if (typeof window !== 'undefined') {
    if (status && username) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      sessionStorage.setItem(SESSION_USER_KEY, username);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
  }
}
