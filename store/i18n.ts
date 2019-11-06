import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'

export const name = 'i18n'

export type Locales = 'en' | 'ru'
export type LocalesList = ['en', 'ru']

export interface I18nStateI {
  locales: string[]
  locale: Locales
}

@Module({ namespaced: true, name })
export class I18n extends VuexModule implements I18nStateI {
  /**
   * Список локалей
   */
  public locales: string[] = ['en', 'ru']

  /**
   * Текущая локаль
   */
  public locale: Locales = 'ru'

  @Mutation
  SET_LANG(locale: Locales) {
    this.locale = locale
  }

  /**
   * Установить локаль
   */
  @Action
  public setLang(locale: Locales) {
    if (!this.locales.includes(locale)) return

    this.SET_LANG(locale)

    if (process.browser) {
      // TODO
      const { $nuxt } = (window as unknown) as {
        $nuxt: { $i18n: { locale: string } }
      }
      $nuxt.$i18n.locale = locale
    }
  }
}
