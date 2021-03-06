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
    const labels = { ...this.labels }

    labels[label.id] = label

    this.labels = labels
  }

  /**
   * Добавить список тегов
   */
  @Mutation
  SET_LABELS(labelsList: Label[]) {
    const labels = { ...this.labels }

    labelsList.forEach((label: Label) => {
      if (label.id) labels[label.id] = label
    })

    this.labels = labels
  }

  /**
   * Убрать тег
   */
  @Mutation
  REMOVE_LABEL(id: string) {
    if (!this.labels[id]) return

    const labels = { ...this.labels }
    delete labels[id]

    this.labels = labels
  }
}
