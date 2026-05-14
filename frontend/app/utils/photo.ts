import type { PhotoMeta } from "~/types/photo";

// CDN-MIGRATION: единая точка резолва URL. Сейчас url приходит готовым в payload
// бэка, и фронт ничего о хранилище не знает. Если в будущем стратегия изменится
// (например, бэк перестанет вшивать url, и фронт будет резолвить ключи через
// storageBase из runtimeConfig) — меняем здесь, остальной фронт остаётся как есть.
export const resolvePhotoUrl = (p: PhotoMeta): string => p.url;
