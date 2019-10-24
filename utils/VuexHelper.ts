import { Store } from 'vuex'
import { GroupState, namespace as groupNamespace } from '~/store/group.ts'

/**
 * Базовый класс для работы с vuex из компонентов
 */

export interface RootStateI {
  [key: string]: any
  [groupNamespace]: GroupState
}

export class VuexHelper<StateI> {
  public namespace: string
  public state: StateI
  public store: Store<RootStateI>

  constructor(store: Store<RootStateI>, namespace: string) {
    this.store = store
    this.namespace = namespace
    this.state = store.state[this.namespace]
  }

  dispatchWithNamespace(action: string, ...args: any) {
    this.store.dispatch(`${this.namespace}/${action}`, ...args)
  }
}
