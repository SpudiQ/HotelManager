type Api = ReturnType<typeof useNuxtApp>["$api"];

export const useApi = (): Api => useNuxtApp().$api;
