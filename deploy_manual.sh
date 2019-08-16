#!/bin/sh
# Деплой приложения на heroku

sudo heroku container:login
sudo docker build -t registry.heroku.com/elplano-nuxt/web .
sudo docker push registry.heroku.com/elplano-nuxt/web
sudo heroku container:release --app elplano-nuxt web