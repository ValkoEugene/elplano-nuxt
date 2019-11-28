import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'

export const name = 'snackbars'

export enum SnackbarColor {
  success = 'success',
  info = 'info',
  error = 'error'
}

export interface SnackbarI {
  text: string
  color: SnackbarColor
}

export interface SnackbarsStateI {
  snackbars: SnackbarI[]
}

@Module({ namespaced: true, name })
export class Snackbars extends VuexModule implements SnackbarsStateI {
  snackbars: SnackbarI[] = []

  @Mutation
  public SET_SNACKBARS(snackbars: SnackbarI[]) {
    this.snackbars = [...snackbars]
  }

  @Mutation
  public ADD_SNACKBARS(snackbars: SnackbarI[]) {
    this.snackbars = [...this.snackbars, ...snackbars]
  }
}
