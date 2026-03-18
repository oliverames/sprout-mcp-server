export type ResponseFormat = "markdown" | "json";

export interface SproutCustomer {
  customer_id: number;
  name: string;
}

export interface SproutProfile {
  customer_profile_id: number;
  network_type: string;
  name: string;
  native_name: string;
  native_id: string;
  groups: number[];
  network_metadata?: Record<string, unknown>;
}

export interface SproutGroup {
  group_id: number;
  name: string;
}

export interface SproutTag {
  tag_id: number;
  any_group: boolean;
  active: boolean;
  text: string;
  type: "LABEL" | "CAMPAIGN";
  groups: number[];
}

export interface SproutUser {
  id: number;
  name: string;
  email: string;
}

export interface SproutTeam {
  id: number;
  name: string;
  description: string;
}

export interface SproutQueue {
  id: number;
  name: string;
  description: string;
  associated_teams: number[];
}

export interface SproutTopic {
  id: number;
  name: string;
  topic_type: string;
  description: string;
  group_id: number;
  theme_groups: unknown[];
  availability_time: string;
}

export interface SproutApiResponse<T> {
  data: T[];
  paging?: IndexPaging | CursorPaging;
  error?: string;
}

export interface IndexPaging {
  current_page: number;
  total_pages: number;
}

export interface CursorPaging {
  next_cursor?: string;
}

export interface PaginationEnvelope<T> {
  data: T[];
  pagination: {
    has_more: boolean;
    next_cursor?: string;
    current_page?: number;
    total_pages?: number;
  };
}

export interface MediaUploadResult {
  media_id: string;
  expiration_time: string;
}

export interface ToolResponse {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  [key: string]: unknown;
}
