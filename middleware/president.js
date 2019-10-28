import { UserModule } from '~/store/user.ts'

// Middleware для проверки является ли пользователь старостой
export default ({ redirect }) => {
  if (!UserModule.isPresident) {
    return redirect('/')
  }
}
