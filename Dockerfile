# Выбор образа для ноды
FROM node:10

# Установка рабочей директории(папки с содержимым приложения)
WORKDIR /app
# Копирование содержимого репозитория в контейнер
COPY . /app/

# Установка глобальных зависимостей
RUN npm i -g npm && npm i -g yarn

# Удаляем lock файлы
RUN rm yarn.lock
RUN rm package-lock.json

RUN yarn
# Собираем проект
RUN yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

# Запускаем приложение
CMD [ "yarn", "start" ]