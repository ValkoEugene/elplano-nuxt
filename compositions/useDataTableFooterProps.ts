// eslint-disable-next-line import/named
import { SetupContext } from '@vue/composition-api'

/**
 * Получить пропсы с локализацией для таблиц vuetify
 */
export const useDataTableFooterProps = (context: SetupContext) => {
  return {
    'items-per-page-all-text': context.root.$t('ui.dataTable.itemsPerPageAll'),
    'items-per-page-text': context.root.$t('ui.dataTable.itemsPerPageText'),
    'page-text': context.root.$t('ui.dataTable.pageText')
  }
}
