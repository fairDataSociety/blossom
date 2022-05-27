export interface ApiResponse {
  requestId: number
  data: unknown
  error: Error | string
}
