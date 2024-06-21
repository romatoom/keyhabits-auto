import { dirname } from "path";
import { fileURLToPath } from "url";

export default function currentPath(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}
