export interface ToastApi {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

declare global {
  interface Window {
    $toast: ToastApi;
  }
}
