interface Window {
  $message: {
    loading: (message: string, config?: { duration: number; closable?: boolean }) => void;
    success: (message: string, config?: { duration: number; closable?: boolean }) => void;
    warn: (message: string, config?: { duration: number; closable?: boolean }) => void;
    error: (message: string, config?: { duration: number; closable?: boolean }) => void;
  };
}
