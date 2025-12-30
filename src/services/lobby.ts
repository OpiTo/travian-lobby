/**
 * Lobby Service - Lobby API interactions
 * 
 * Endpoints:
 * - POST /api/auth/code - Exchange auth code for session
 * - POST /api/auth/logout - Logout
 * - PUT /api/identity/password - Request password change
 * - POST /api/identity/password?code={code} - Confirm password change
 * - PATCH /api/account/name - Set account name
 * - PATCH /api/account/options - Update account options
 * - PATCH /api/account/consent - Update consent
 * - GET /api/metadata - Get lobby metadata
 */

import { lobbyRequest, request } from './api';
import { config } from '../config/config';

export interface AuthorizePayload {
  code: string;
  code_verifier: string;
  [key: string]: unknown;
}

export interface AuthorizeResponse {
  success?: boolean;
}

export interface PasswordChangeRequestPayload {
  login: string;
  locale: string;
}

export interface PasswordChangeConfirmPayload {
  password: string;
}

export interface AccountNamePayload {
  name: string;
}

export interface AccountOptionsPayload {
  [key: string]: unknown;
}

export interface ConsentPayload {
  [key: string]: boolean;
}

export interface MetadataResponse {
  [key: string]: unknown;
}

export interface GameworldInfo {
  [key: string]: unknown;
}

export interface NewsItem {
  id: string;
  title: string;
  previewText?: string;
  headerImage?: string;
  date: number;
  fullHTMLText?: string;
}

export interface CalendarEntry {
  _id: string;
  uuid?: string;
  name?: string;
  url?: string;
  start: number;
  end?: number;
  trackingUrl?: string;
  adcode?: string;
  notification?: boolean;
  registrationClosed?: boolean;
  registrationKeyRequired?: boolean;
  metadata: {
    name?: string;
    subtitle?: string;
    speed?: number;
    type?: string;
    mainpageBackground?: string;
    tribes?: string[];
    artefacts?: string;
    constructionPlans?: string;
    endCondition?: number;
    filter?: string[];
    recommended?: string[];
    mainpageGroups?: string[];
    url?: string;
  };
  flags: {
    registrationClosed?: boolean;
    registrationKeyRequired?: boolean;
    isActive?: boolean;
  };
  info?: {
    tribes?: number[];
    artefactsDate?: number;
    constructionPlansDate?: number;
    serverConfiguration?: {
      languages?: string[];
    };
  };
}

/**
 * Exchange auth code for session
 */
export async function authorize(
  code: string,
  codeVerifier: string,
  additionalData: Record<string, unknown> = {}
): Promise<AuthorizeResponse> {
  return lobbyRequest<AuthorizeResponse>(
    '/api/auth/code',
    { ...additionalData, code, code_verifier: codeVerifier },
    { method: 'POST' }
  );
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  await lobbyRequest('/api/auth/logout', {}, { method: 'POST' });
}

/**
 * Request password change (sends email)
 */
export async function passwordChangeRequest(login: string, locale: string): Promise<void> {
  await lobbyRequest(
    '/api/identity/password',
    { login, locale },
    { method: 'PUT' }
  );
}

/**
 * Confirm password change (with code from email)
 */
export async function passwordChangeConfirm(code: string, password: string): Promise<void> {
  await lobbyRequest(
    `/api/identity/password?code=${code}`,
    { password },
    { method: 'POST' }
  );
}

/**
 * Set account name
 */
export async function setName(name: string): Promise<void> {
  await lobbyRequest('/api/account/name', { name }, { method: 'PATCH' });
}

/**
 * Update account options
 */
export async function updateOptions(options: AccountOptionsPayload): Promise<void> {
  await lobbyRequest('/api/account/options', options, { method: 'PATCH' });
}

/**
 * Update consent settings
 */
export async function updateConsent(consent: ConsentPayload): Promise<void> {
  await lobbyRequest('/api/account/consent', consent, { method: 'PATCH' });
}

/**
 * Get lobby metadata
 */
export async function getMetadata(): Promise<MetadataResponse> {
  return request<MetadataResponse>(new URL('/api/metadata', config.lobby.host));
}

/**
 * Get gameworld info
 */
export async function getGameworldInfo(id: string): Promise<GameworldInfo> {
  return request<GameworldInfo>(new URL(`/api/metadata/info/${id}`, config.lobby.host));
}

/**
 * Get news
 */
export async function getNews(after?: string, amount: number = 10): Promise<NewsItem[]> {
  return request<NewsItem[]>(
    new URL(`/api/news?after=${after || ''}&amount=${amount}`, config.lobby.host)
  );
}

/**
 * Get single news article
 */
export async function getArticle(id: string): Promise<NewsItem> {
  return request<NewsItem>(new URL(`/api/news/${id}`, config.lobby.host));
}

/**
 * Get calendar
 */
export async function getCalendar(): Promise<CalendarEntry[]> {
  return request<CalendarEntry[]>(new URL('/api/calendar', config.lobby.host));
}

/**
 * GraphQL query
 */
export async function graphql<T>(query: string, options: RequestInit = {}): Promise<T> {
  const response = await lobbyRequest<{ data: T }>(
    '/api/graphql',
    { query: 'query' + query },
    { ...options, method: 'POST' }
  );
  return response.data;
}

/**
 * Get current session/account info
 * Returns null if not authenticated
 */
export async function getSession(): Promise<{ guid: string; name: string } | null> {
  try {
    const result = await graphql<{ session: { identity: { guid: string; name: string } | null } }>(
      '{session{identity{guid name}}}',
      { signal: AbortSignal.timeout(2000) }
    );
    return result.session?.identity ?? null;
  } catch {
    return null;
  }
}

/**
 * Get avatars for current user
 */
export async function getAvatars(): Promise<Array<{ gameworld: { uuid: string } }>> {
  try {
    const result = await graphql<{ avatars: Array<{ gameworld: { uuid: string } }> }>(
      '{avatars{gameworld{uuid}}}'
    );
    return result.avatars ?? [];
  } catch {
    return [];
  }
}

/**
 * Read all calendar notifications
 */
export async function readAllCalendarNotifications(): Promise<void> {
  await lobbyRequest('/api/notification/readAll', {}, { method: 'POST' });
}

// Calendar notification interfaces
export interface CalendarNotification {
  calendarGameworldId: string;
}

export interface CalendarNotificationsResponse {
  unreadCount: number;
  list: CalendarNotification[];
}

/**
 * Get calendar notifications for current user
 */
export async function getCalendarNotifications(): Promise<CalendarNotificationsResponse> {
  try {
    const result = await graphql<{
      notification: CalendarNotificationsResponse;
    }>('{notification{unreadCount list{...on NotificationCalendarGameworld{calendarGameworldId}}}}');
    return result.notification;
  } catch {
    return { unreadCount: 0, list: [] };
  }
}

// Avatar Play/Register interfaces
export interface PlayAvatarResponse {
  redirectTo: string;
}

export interface RegisterAvatarResponse {
  redirectTo: string;
}

// Gold Transfer (GTL) interfaces
export interface GtlVerifyOwnershipResponse {
  amount: number;
}

export interface GtlFindTargetsResponse {
  targets: string[];
  transferTargets: Record<string, string>;
}

export interface GtlTransferResponse {
  state: 'consumed' | 'pending';
}

/**
 * Play existing avatar on gameworld
 */
export async function playAvatar(uuid: string): Promise<PlayAvatarResponse> {
  return lobbyRequest<PlayAvatarResponse>(
    `/api/avatar/play/${uuid}`,
    {},
    { method: 'POST' }
  );
}

/**
 * Register new avatar on gameworld
 */
export async function registerAvatar(
  wuid: string,
  adCode?: string,
  invitedBy?: string,
  registrationKey?: string
): Promise<RegisterAvatarResponse> {
  return lobbyRequest<RegisterAvatarResponse>(
    '/api/avatar/play',
    { wuid, adCode, invitedBy, registrationKey },
    { method: 'POST' }
  );
}

/**
 * GTL - Verify ownership of gold
 */
export async function gtlVerifyOwnership(
  code: string,
  email: string
): Promise<GtlVerifyOwnershipResponse> {
  return lobbyRequest<GtlVerifyOwnershipResponse>(
    '/api/gtl/verifyOwnership',
    { code, email },
    { method: 'POST' }
  );
}

/**
 * GTL - Find transfer targets
 */
export async function gtlFindTargets(
  code: string,
  email: string,
  name: string
): Promise<GtlFindTargetsResponse> {
  return lobbyRequest<GtlFindTargetsResponse>(
    '/api/gtl/findTargets',
    { code, email, name },
    { method: 'POST' }
  );
}

/**
 * GTL - Execute gold transfer
 */
export async function gtlTransfer(
  code: string,
  email: string,
  uuid: string
): Promise<GtlTransferResponse> {
  return lobbyRequest<GtlTransferResponse>(
    '/api/gtl/transfer',
    { code, email, uuid },
    { method: 'POST' }
  );
}
