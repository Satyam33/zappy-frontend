/** Socket.IO connects to API origin (no `/api/v1`). Optional `VITE_WS_URL` override. */
export const getSocketBaseUrl = (): string => {
  const api =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    'https://zappy-backend-aqdo.onrender.com/api/v1'
  return api.replace(/\/api\/v1\/?$/, '')
}
