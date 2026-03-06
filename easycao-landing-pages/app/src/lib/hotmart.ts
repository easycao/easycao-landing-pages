import type { EngagementLevel } from "./crm/types";

const OAUTH_URL = "https://api-sec-vlc.hotmart.com/security/oauth/token";
const API_BASE = "https://developers.hotmart.com";
const PRODUCT_ID = "735381";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.HOTMART_CLIENT_ID!,
    client_secret: process.env.HOTMART_CLIENT_SECRET!,
  });

  const res = await fetch(`${OAUTH_URL}?${params.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.HOTMART_BASIC_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Hotmart OAuth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

async function hotmartFetch(path: string, params?: Record<string, string>) {
  const token = await getAccessToken();
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Rate limit handling
  const remaining = res.headers.get("X-RateLimit-Remaining-Minute");
  if (remaining && parseInt(remaining) < 10) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  if (!res.ok) {
    throw new Error(
      `Hotmart API ${path} failed: ${res.status} ${await res.text()}`
    );
  }

  return res.json();
}

// --- Engagement & User Info ---

export interface HotmartUserInfo {
  engagement: EngagementLevel;
  status: string | null;
  progress: number | null;
}

export async function getHotmartUserInfo(
  email: string
): Promise<HotmartUserInfo> {
  try {
    const subdomain = process.env.HOTMART_CLUB_SUBDOMAIN!;
    const data = await hotmartFetch("/club/api/v1/users", { subdomain, email });
    const user = data?.items?.[0];
    return {
      engagement: (user?.engagement as EngagementLevel) || "NONE",
      status: user?.status || null,
      progress: user?.progress?.completed_percentage ?? null,
    };
  } catch (error) {
    console.error(`Hotmart getHotmartUserInfo failed for ${email}:`, error);
    return { engagement: "NONE", status: null, progress: null };
  }
}

// --- Paginated fetchers for seed ---

export interface ClubUser {
  user_id: string;
  email: string;
  name: string;
  engagement: string;
  status: string;
  purchase_date: number;
  progress?: { completed: number; completed_percentage: number; total: number };
}

export async function getAllClubUsers(): Promise<ClubUser[]> {
  const allUsers: ClubUser[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string> = {
      subdomain: process.env.HOTMART_CLUB_SUBDOMAIN!,
      max_results: "100",
    };
    if (pageToken) params.page_token = pageToken;

    const data = await hotmartFetch("/club/api/v1/users", params);
    const items = data?.items || [];
    allUsers.push(...items);
    pageToken = data?.page_info?.next_page_token;
  } while (pageToken);

  return allUsers;
}

export interface HotmartSale {
  buyer: {
    email: string;
    name: string;
    first_name?: string;
    last_name?: string;
    checkout_phone?: string;
    checkout_phone_code?: string;
    document?: string;
    address?: {
      city?: string;
      state?: string;
    };
  };
  purchase: {
    transaction: string;
    approved_date: number;
    status: string;
    price: { value: number };
    payment: { type: string; installments_number: number };
    offer: { code: string };
  };
}

export async function getAllSales(): Promise<HotmartSale[]> {
  const allSales: HotmartSale[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string> = {
      product_id: PRODUCT_ID,
      max_results: "100",
    };
    if (pageToken) params.page_token = pageToken;

    const data = await hotmartFetch(
      "/payments/api/v1/sales/history",
      params
    );
    const items = data?.items || [];
    allSales.push(...items);
    pageToken = data?.page_info?.next_page_token;
  } while (pageToken);

  return allSales;
}
