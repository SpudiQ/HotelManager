import { skeletonDirective } from "~/directives/skeleton";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("skeleton", skeletonDirective);
});
