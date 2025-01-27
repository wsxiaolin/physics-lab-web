interface Window {
  $message: {
    loading: (message: string, config?: { duration: number }) => void;
    success: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}
