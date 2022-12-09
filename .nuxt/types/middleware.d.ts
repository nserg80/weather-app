import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "D:/Work/test_tasks/frontco/weather-app/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}