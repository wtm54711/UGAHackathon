"use client";

// Mock authentication for development/testing

type AuthUser = {
  id: string;
  email: string;
};

type AuthResponse = {
  data: { user: AuthUser | null };
  error: { message: string } | null;
};

const USERS_KEY = "athens_helper_users";
const SESSION_KEY = "athens_helper_session";

// Get all users from localStorage
function getUsers(): Record<string, { email: string; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch {
    return {};
  }
}

// Save users to localStorage
function saveUsers(
  users: Record<string, { email: string; password: string }>
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Set session
function setSession(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Get current session
function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

// Clear session
function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export const mockAuth = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();

    // Check if user already exists
    if (users[email]) {
      return {
        data: { user: null },
        error: { message: "User already exists with that email" },
      };
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    users[email] = { email, password };
    saveUsers(users);

    const user: AuthUser = { id: userId, email };
    setSession(user);

    return {
      data: { user },
      error: null,
    };
  },

  async signInWithPassword(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    const user = users[email];

    if (!user || user.password !== password) {
      return {
        data: { user: null },
        error: { message: "Invalid email or password" },
      };
    }

    const authUser: AuthUser = { id: `user_${email}`, email };
    setSession(authUser);

    return {
      data: { user: authUser },
      error: null,
    };
  },

  async getUser() {
    return { user: getSession(), error: null };
  },

  async signOut() {
    clearSession();
    return { error: null };
  },

  onAuthStateChange(
    callback: (event: string, session: { user: AuthUser } | null) => void
  ) {
    const user = getSession();
    callback("INITIAL_SESSION", user ? { user } : null);

    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};
