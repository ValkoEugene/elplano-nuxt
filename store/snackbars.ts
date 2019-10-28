import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
// import {
//   namespace as snackbarNamespace,
//   Types as snackbarTypes
// } from '~/store/snackbars'
import store from '~/store'

export enum SnackbarColor {
  success = 'success',
  info = 'info',
  error = 'error'
}

export interface Snackbar {
  text: string
  color: SnackbarColor
}

export interface SnackbarsStateI {
  snackbars: Snackbar[]
}

@Module({ dynamic: true, store: store(), name: 'snackbars' })
class Snackbars extends VuexModule implements SnackbarsStateI {
  snackbars: Snackbar[] = []

  @Mutation
  public SET_SNACKBARS(snackbars: Snackbar[]) {
    this.snackbars = [...snackbars]
  }

  @Mutation
  public ADD_SNACKBARS(snackbars: Snackbar[]) {
    this.snackbars = [...this.snackbars, ...snackbars]
  }
}

export const SnackbarsModule = getModule(Snackbars)
