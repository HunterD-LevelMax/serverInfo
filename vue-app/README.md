# Server Monitoring Dashboard - Vue.js

Веб-приложение для мониторинга сервера, построенное на Vue.js 3.

## Особенности

- 📊 Мониторинг CPU, памяти и диска в реальном времени
- 👥 Отслеживание уникальных посетителей
- 🌐 Статистика Nginx
- 📡 Мониторинг сетевого трафика
- 🐳 Статус Docker контейнеров
- 🔌 Отображение открытых портов
- 🔄 Автоматическое обновление данных
- 💾 Сохранение настроек в localStorage

## Технологии

- **Vue.js 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Composition API** - Modern Vue.js architecture

## Структура проекта

```
vue-app/
├── index.html              # Точка входа HTML
├── package.json            # Зависимости npm
├── vite.config.js          # Конфигурация Vite
└── src/
    ├── main.js             # Точка входа JavaScript
    ├── App.vue             # Главный компонент
    ├── styles/
    │   └── main.css        # Глобальные стили
    ├── components/
    │   ├── ControlsPanel.vue    # Панель управления
    │   ├── InfoCard.vue         # Основная информация
    │   ├── VisitorsCard.vue     # Посетители
    │   ├── CpuCard.vue          # CPU нагрузка
    │   ├── MemoryCard.vue       # Память
    │   ├── DiskCard.vue         # Диск
    │   ├── NginxCard.vue        # Nginx статистика
    │   ├── TrafficCard.vue      # Сетевой трафик
    │   ├── PortsCard.vue        # Открытые порты
    │   └── DockerCard.vue       # Docker контейнеры
    ├── composables/
    │   └── useServerMonitor.js  # Логика мониторинга
    └── services/
        └── api.js               # API сервис
```

## Установка и запуск

### Разработка

```bash
# Переход в директорию проекта
cd vue-app

# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev
```

### Продакшн сборка

```bash
# Сборка для продакшн
npm run build

# Предпросмотр сборки
npm run preview
```

## API

Приложение использует PHP бэкенд (`../server_data.php`) для получения данных.

### Формат ответа API

```json
{
  "success": true,
  "hostname": "server-name",
  "server_ip": "192.168.1.1",
  "current_ip": "192.168.1.100",
  "server_time": "2024-01-01 12:00:00",
  "uptime": "10 д, 5 ч, 30 мин",
  "load_1min": "0.50",
  "load_5min": "0.45",
  "load_15min": "0.40",
  "temperature": 45,
  "memory_total": "16.00",
  "memory_used": "8.00",
  "memory_used_percent": 50,
  "disk_total": "500.00",
  "disk_used": "250.00",
  "disk_used_percent": 50,
  "nginx_active": 10,
  "nginx_requests": "10000",
  "traffic_in": 100,
  "traffic_out": 50,
  "unique_ips": {
    "total": 100,
    "today": 25,
    "current_hour": 5,
    "recent": ["192.168.1.1", "192.168.1.2"]
  },
  "docker_containers": [
    {"name": "container1", "status": "running", "uptime": "2 hours"}
  ],
  "open_ports": ["80", "443", "22"]
}
```

## Настройка

### Интервал обновления

Можно настроить интервал автоматического обновления от 1 до 30 секунд.

### Режимы работы

- **Реальное время** - автоматическое обновление данных
- **Статичный** - ручное обновление по кнопке

## Развертывание на сервере

1. Соберите приложение:
   ```bash
   npm run build
   ```

2. Скопируйте содержимое папки `dist/` на сервер

3. Убедитесь, что `server_data.php` доступен по относительному пути

### Пример конфигурации Nginx

```nginx
server {
    listen 80;
    server_name monitor.example.com;
    root /var/www/monitor;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

## Лицензия

MIT
