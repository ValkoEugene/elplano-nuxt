<template>
  <div>
    <div class="extral-links__title">
      <CustomTitle> {{ $t('field.extraLinks') }} </CustomTitle>
      <v-btn color="primary" text @click="addNew">
        {{ $t('ui.add') }}
      </v-btn>
    </div>

    <v-alert
      v-if="!extraLinks.length"
      type="info"
      color="blue"
      class="mb-6"
      text
    >
      <span> {{ $t('ui.no-data') }} </span>
    </v-alert>

    <template v-else>
      <div
        v-for="(extraLink, index) in extraLinks"
        :key="`social-network-${index}`"
        class="extral-links__item"
      >
        <div class="item__fields">
          <v-text-field
            v-model="extraLink.url"
            label="Url"
            :rules="[$rules.required, $rules.url]"
            type="text"
            outlined
          />

          <v-textarea
            v-model.trim="extraLink.description"
            :label="$t('field.description')"
            rows="4"
            outlined
          />
        </div>

        <v-btn
          color="error"
          small
          text
          class="item__delete"
          @click="remove(index)"
        >
          {{ $t('ui.delete') }}
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { ExtraLink } from '~/api/tasks.ts'

interface PropsI {
  /** Список ссылок */
  extraLinks: ExtraLink[]
}

export default defineComponent({
  name: 'ExtraLinks',
  components: {
    CustomTitle: () =>
      import(
        '~/components/UI-core/custom-title.vue' /* webpackChunkName: 'components/UI-core/custom-title' */
      )
  },
  props: {
    extraLinks: {
      type: Array as () => ExtraLink[],
      required: true
    }
  },
  model: {
    prop: 'extraLinks',
    event: 'input'
  },
  setup(props: PropsI, context) {
    /** Добавить новую ссылку */
    const addNew = () => {
      const newExtraLinks: ExtraLink[] = [
        ...props.extraLinks,
        { description: '', url: '' }
      ]
      context.emit('input', newExtraLinks)
    }

    /** Удалить данные о ссылке */
    const remove = (removedIndex: number) => {
      context.emit(
        'input',
        props.extraLinks.filter((_, index) => index !== removedIndex)
      )
    }

    return {
      addNew,
      remove
    }
  }
})
</script>

<style scoped>
.extral-links__title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.extral-links__item {
  display: flex;
  flex-direction: column-reverse;
}

.item__fields {
  flex-grow: 1;
}

.item__delete {
  align-self: flex-end;
}
</style>
