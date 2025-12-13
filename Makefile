.PHONY: help dev build up down logs clean migrate generate

help:
	@echo "دستورات موجود:"
	@echo "  make dev        - راه‌اندازی در حالت Development"
	@echo "  make build     - ساخت پروژه"
	@echo "  make up        - راه‌اندازی کانتینرها"
	@echo "  make down      - توقف کانتینرها"
	@echo "  make logs      - مشاهده لاگ‌ها"
	@echo "  make clean     - پاک کردن کانتینرها و volume ها"
	@echo "  make migrate   - اجرای migration ها"
	@echo "  make generate  - تولید Prisma Client"

dev:
	docker-compose -f docker-compose.dev.yml up -d

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec backend npx prisma migrate dev

generate:
	docker-compose exec backend npx prisma generate

studio:
	docker-compose exec backend npx prisma studio

