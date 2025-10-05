export interface ErrorResponse {
  message?: string;
  error?: string;
  [field: string]: string | undefined;
}

export interface HttpClientOptions {
  baseUrl?: string;
}
