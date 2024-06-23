import { dirname } from "path";
import { fileURLToPath } from "url";

// Получение пути до папки с модулем (принимает значение import.meta.url)
export default function currentPath(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}
