import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
// import {
//   namespace as snackbarNamespace,
//   Types as snackbarTypes
// } from '~/store/snackbars'
import store from '~/store'

export type Locales = 'en' | 'ru'
export type LocalesList = ['en', 'ru']

export interface I18nStateI {
  locales: string[]
  locale: Locales
}

@Module({ dynamic: true, store: store(), name: 'i18n' })
class I18n extends VuexModule implements I18nStateI {
  /**
   * Список локалей
   */
  public locales: string[] = ['en', 'ru']

  /**
   * Текущая локаль
   */
  public locale: Locales = 'ru'

  @Mutation
  private SET_LANG(locale: Locales) {
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

export const I18nModule = getModule(I18n)
