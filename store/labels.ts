import { VuexModule, Module, Mutation } from 'vuex-module-decorators'
import { Label } from '~/api/labels.ts'

export const name = 'labels'

export interface LabelsStateI {
  labels: { [id: string]: Label }
}

@Module({ namespaced: true, name })
export class Labels extends VuexModule implements LabelsStateI {
  /**
   * Хэш с тегами по ключам из id
   */
  public labels: { [id: string]: Label } = {}

  /**
   * Добавить тег
   */
  @Mutation
  SET_LABEL(label: Label) {
    if (!label.id) return

    this.labels[label.id] = label
  }

  /**
   * Добавить список тегов
   */
  @Mutation
  SET_LABELS(labels: Label[]) {
    labels.forEach((label: Label) => {
      if (label.id) this.labels[label.id] = label
    })
  }
}
