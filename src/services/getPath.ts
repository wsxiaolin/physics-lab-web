const apiUrl = import.meta.env.VITE_API_URL;

export default function (path: string) {
  return path.replace(/\/api/g, apiUrl);
}
