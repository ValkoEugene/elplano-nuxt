<template>
  <div>
    <div class="socail-networks__title">
      <CustomTitle> {{ $t('field.socialNetworks') }} </CustomTitle>
      <v-btn color="primary" text @click="addNew">
        {{ $t('ui.add') }}
      </v-btn>
    </div>

    <v-alert
      v-if="!socialNetworks.length"
      type="info"
      color="blue"
      class="mb-6"
      text
    >
      <span> {{ $t('ui.no-data') }} </span>
    </v-alert>

    <template v-else>
      <div
        v-for="(socialNetwork, index) in socialNetworks"
        :key="`social-network-${index}`"
        class="socail-networks__item"
      >
        <div class="item__fields">
          <v-combobox
            v-model="socialNetwork.network"
            :items="availableDefaultSocialNetworksNetworks"
            :label="$t('field.network')"
            :rules="[$rules.required]"
            outlined
          />

          <v-text-field
            v-model="socialNetwork.url"
            label="Url"
            :rules="[$rules.required, $rules.url]"
            type="text"
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
import { defineComponent, computed } from '@vue/composition-api'
import { SocialNetwork } from '~/api/group-users.ts'

interface PropsI {
  /** Список социальных сетей */
  socialNetworks: SocialNetwork[]
}

export default defineComponent({
  name: 'SocialNwtworks',
  components: {
    CustomTitle: () =>
      import(
        '~/components/UI-core/custom-title.vue' /* webpackChunkName: 'components/UI-core/custom-title' */
      )
  },
  props: {
    socialNetworks: {
      type: Array as () => SocialNetwork[],
      required: true
    }
  },
  model: {
    prop: 'socialNetworks',
    event: 'input'
  },
  setup(props: PropsI, context) {
    /** Добавить новую соц. сеть */
    const addNew = () => {
      const newSocialNetworks: SocialNetwork[] = [
        ...props.socialNetworks,
        { network: '', url: '' }
      ]
      context.emit('input', newSocialNetworks)
    }

    /** Список сервисов соц. сетей по умолчанию */
    const defaultSocialNetworksNetworks: string[] = [
      'vkontakte',
      'facebook',
      'twitter',
      'instagram'
    ]
    /** Список используемых сервисов соц. сетей */
    const usedSocialNetworks = computed(() =>
      props.socialNetworks.map((item) => item.network)
    )
    /** Список доступных сервисов соц. сетей по умолчанию */
    const availableDefaultSocialNetworksNetworks = computed(() =>
      defaultSocialNetworksNetworks.filter(
        (item) => !usedSocialNetworks.value.includes(item)
      )
    )

    /** Удалить данные о соц. сети */
    const remove = (removedIndex: number) => {
      context.emit(
        'input',
        props.socialNetworks.filter((_, index) => index !== removedIndex)
      )
    }

    return {
      addNew,
      availableDefaultSocialNetworksNetworks,
      remove
    }
  }
})
</script>

<style scoped>
.socail-networks__title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.mobile .socail-networks__title {
  margin-bottom: 15px;
}

.socail-networks__item {
  display: flex;
  justify-content: space-between;
}

.mobile .socail-networks__item {
  flex-direction: column-reverse;
}

.item__fields {
  flex-grow: 1;
}

.mobile .item__delete {
  align-self: flex-end;
}
</style>
