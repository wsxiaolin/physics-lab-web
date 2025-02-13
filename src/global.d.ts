interface Window {
  $message: {
    loading: (message: string, config?: { duration: number; closable?: boolean }) => void;
    success: (message: string, config?: { duration: number; closable?: boolean }) => void;
    warning: (message: string, config?: { duration: number; closable?: boolean }) => void;
    error: (message: string, config?: { duration: number; closable?: boolean }) => void;
    info: (message: string, config?: { duration: number; closable?: boolean }) => void;
    destroyAll: () => void;
  };
  $getPath: (path: string) => string;
}
