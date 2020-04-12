# Выбор образа для ноды
FROM node:12

# Установка рабочей директории(папки с содержимым приложения)
WORKDIR /app
# Копирование содержимого репозитория в контейнер
COPY . /app/

# Удаляем lock файлы
RUN rm yarn.lock

RUN yarn
# Собираем проект
RUN yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

# Запускаем приложение
CMD [ "yarn", "start" ]