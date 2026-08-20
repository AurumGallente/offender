COMPOSE = docker compose

.PHONY: build up down restart logs update

# Собрать образ
build:
	$(COMPOSE) build

# Запустить (с пересборкой)
up:
	$(COMPOSE) up -d --build

# Остановить и удалить контейнеры
down:
	$(COMPOSE) down

# Полный перезапуск: остановить, удалить и снова запустить
restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

# Логи
logs:
	$(COMPOSE) logs -f

# Обновление одной командой: пересборка образа и полный перезапуск
update: build restart
	@echo "PWA обновлена и перезапущена"