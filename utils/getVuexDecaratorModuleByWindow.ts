import { getModule, VuexModule } from 'vuex-module-decorators'

declare type ConstructorOf<C> = {
  new (...args: any[]): C
}

/**
 * Получить модуль vuex-decarator для работы с Vuex
 */
export function getVuexDecaratorModuleByWindow<T extends VuexModule>(
  vuexModule: ConstructorOf<T>
): T {
  if (!process.browser)
    throw new Error(`
    Доступ к модулю через window.$nuxt.$store возможен только на стороне клиента.
    Необходим чтобы вызывать модули внутри друг друга.
  `)

  const {
    $nuxt: { $store }
  } = window as any

  return getModule(vuexModule, $store)
}
