export const BASE_URL = "https://api.sproutsocial.com";

export const OAUTH_TOKEN_ENDPOINT =
  "https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/v1/token";

export const RATE_LIMIT_PER_MINUTE = 60;
export const RATE_LIMIT_SOFT_CAP = 55;

export const REQUEST_TIMEOUT_MS = 30_000;

export const MAX_RETRIES = 3;
export const RETRY_BASE_DELAY_MS = 1000;
export const MAX_202_RETRIES = 5;

export const CHARACTER_LIMIT = 25_000;

export const MAX_PROFILES_PER_REQUEST = 100;
export const MAX_MESSAGE_IDS_PER_REQUEST = 100;
export const MAX_CASE_IDS_PER_REQUEST = 100;
export const CASES_MAX_DATE_RANGE_DAYS = 7;
export const ANALYTICS_MAX_DATE_RANGE_DAYS = 365;

export const RETRYABLE_STATUS_CODES = [429, 500, 503, 504];
export const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 405, 415];
