interface USER {
  id: number;
  username: string;
  password: string;
  refreshToken?: string;
  roles: { "user": number; "admin"?: number };
}

interface ROLE {
  "user": number;
  "admin"?: number;
}
