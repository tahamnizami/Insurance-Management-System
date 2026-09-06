export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: AdminUser;
}

interface AdminLoginRequest {
  email: string;
  password: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
).replace(/\/$/, "");

export async function loginAdmin(
  credentials: AdminLoginRequest,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json().catch(() => null)) as
    | AdminLoginResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      data && "message" in data && data.message
        ? data.message
        : "Unable to sign in. Please check your credentials.",
    );
  }

  if (
    !data ||
    !("accessToken" in data) ||
    !data.accessToken ||
    !("admin" in data) ||
    !data.admin
  ) {
    throw new Error("The server returned an invalid sign-in response.");
  }

  return data;
}

export async function logoutAdmin(accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to sign out from the server.");
  }
}
