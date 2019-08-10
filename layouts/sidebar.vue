<template>
  <v-navigation-drawer app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Elplano</v-list-item-title>
        <v-list-item-subtitle>ValkoEugene</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
  data: () => ({
    items: [
      { title: 'Расписание', icon: 'mdi-view-dashboard' },
      { title: 'Предметы', icon: 'mdi-library-books' },
      { title: 'Задания', icon: 'mdi-briefcase' },
      { title: 'Преподаватели', icon: 'mdi-account-supervisor' },
      { title: 'Группа', icon: 'mdi-account-group' },
      { title: 'Мероприятия', icon: 'mdi-help-box' },
      { title: 'Оценки', icon: 'mdi-star-half' },
      { title: 'Вложения', icon: 'mdi-briefcase-download' }
    ]
  })
}
</script>
