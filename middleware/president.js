import { namespace, Types } from '~/store/user'

// Middleware для проверки является ли пользователь старостой
export default ({ store, redirect }) => {
  if (!store.getters[`${namespace}/${Types.getters.IS_PRESIDENT}`]) {
    return redirect('/')
  }
}
