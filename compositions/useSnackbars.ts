// eslint-disable-next-line import/named
import { SetupContext } from '@vue/composition-api'
import { SnackbarColor, SnackbarI } from '~/store/snackbars.ts'

/**
 * Показ уведомлений
 */
export const useSnackbars = (context: SetupContext) => {
  const addErrorSnackbar = (text: string) => {
    context.root.$vuexModules.Snackbars.ADD_SNACKBARS([
      { text, color: SnackbarColor.error }
    ])
  }

  const addSuccessSnackbar = (text: string) => {
    context.root.$vuexModules.Snackbars.ADD_SNACKBARS([
      { text, color: SnackbarColor.success }
    ])
  }

  const addInfoSnackbar = (text: string) => {
    context.root.$vuexModules.Snackbars.ADD_SNACKBARS([
      { text, color: SnackbarColor.info }
    ])
  }

  const addErrorSnackbars = (snackbars: SnackbarI[]) => {
    context.root.$vuexModules.Snackbars.ADD_SNACKBARS(snackbars)
  }

  return {
    addErrorSnackbar,
    addSuccessSnackbar,
    addInfoSnackbar,
    addErrorSnackbars
  }
}
