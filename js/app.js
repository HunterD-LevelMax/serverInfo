/**
 * Мониторинг сервера - компактная версия
 */

// Конфигурация
const C = {
    interval: 5,
    realtime: true,
    url: 'server_data.php'
};

// DOM элементы
const $ = id => document.getElementById(id);
let timer = null, count = 0;

// Сохранение настроек
function save() {
    localStorage.setItem('monitor_int', C.interval);
    localStorage.setItem('monitor_realtime', C.realtime);
}

// Загрузка настроек
function load() {
    const i = localStorage.getItem('monitor_int');
    const r = localStorage.getItem('monitor_realtime');
    if (i) C.interval = +i;
    if (r !== null) C.realtime = r === 'true';
    $('interval-input').value = C.interval;
    updateModeUI();
}

// Обновление UI режима
function updateModeUI() {
    const rt = $('mode-realtime');
    const st = $('mode-static');
    if (C.realtime) {
        rt.classList.add('active');
        st.classList.remove('active');
        $('status-text').innerHTML = `🟢 Автообновление (${C.interval} сек)`;
    } else {
        st.classList.add('active');
        rt.classList.remove('active');
        $('status-text').innerHTML = `⏸️ Статичный режим`;
    }
}

// Форматирование чисел
const fmt = n => Number(n).toFixed(2);

// Экранирование HTML
const esc = s => s ? String(s).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]) : '';

// Получение данных
async function fetchData() {
    if (!C.realtime && timer) return;
    count++;
    $('update-counter').innerHTML = `Обновлений: ${count}`;
    
    try {
        const res = await fetch(`${C.url}?_=${Date.now()}`);
        if (!res.ok) throw new Error();
        const d = await res.json();
        if (d.success) render(d);
    } catch(e) {
        $('server-data').innerHTML = `<div class="card"><div style="color:#f44336;text-align:center">❌ Ошибка загрузки</div></div>`;
    }
}

// Рендеринг
function render(d) {
    const ip = d.unique_ips || {};
    const html = `
        <div class="card">
            <h2>📌 Основная информация</h2>
            ${row('Имя сервера', d.hostname)}
            ${row('IP сервера', d.server_ip)}
            ${row('Ваш IP', `<span class="badge badge-info">${esc(ip.current || d.current_ip)}</span>`)}
            ${row('Время работы', d.uptime)}
            ${row('Текущее время', `<span id="server-time">${d.server_time}</span>`)}
        </div>
        <div class="grid">
            <div class="card">
                <h2>👥 Уникальные посетители</h2>
                ${metric(ip.total || 0, 'Всего уникальных IP')}
                ${metric(ip.today || 0, 'Сегодня')}
                ${metric(ip.current_hour || 0, 'За последний час')}
                ${ip.recent ? `<div class="info-label" style="margin-top:15px">Последние 10 IP:</div>
                <div class="ip-list">${ip.recent.map(i => `<div class="ip-item">📍 ${esc(i)}</div>`).join('')}</div>` : ''}
            </div>
            <div class="card">
                <h2>💻 Нагрузка CPU</h2>
                ${metric(d.load_1min, 'За 1 минуту')}
                ${metric(d.load_5min, 'За 5 минут')}
                ${metric(d.load_15min, 'За 15 минут')}
                ${d.temperature ? row('🌡️ Температура', `${d.temperature}°C`) : ''}
            </div>
            <div class="card">
                <h2>🧠 Оперативная память</h2>
                ${metric(`${d.memory_total} GB`, 'Всего')}
                ${metric(`${d.memory_used} GB (${d.memory_used_percent}%)`, 'Использовано')}
            </div>
            <div class="card">
                <h2>💾 Дисковое пространство</h2>
                ${metric(`${d.disk_total} GB`, 'Всего')}
                ${metric(`${d.disk_used} GB (${d.disk_used_percent}%)`, 'Использовано')}
            </div>
            <div class="card">
                <h2>🌐 Nginx статистика</h2>
                ${metric(d.nginx_active, 'Активных соединений')}
                ${row('Всего запросов', d.nginx_requests)}
            </div>
            <div class="card">
                <h2>📡 Сетевой трафик</h2>
                ${metric(`${d.traffic_in} KB/s`, 'Входящий')}
                ${metric(`${d.traffic_out} KB/s`, 'Исходящий')}
                ${row('Всего RX', d.total_rx)}
                ${row('Всего TX', d.total_tx)}
            </div>
        </div>
        ${d.open_ports?.length ? `
        <div class="card">
            <h2>🔌 Открытые порты</h2>
            <div class="port-list">${d.open_ports.map(p => `<span class="port-item">${p}</span>`).join('')}</div>
        </div>` : ''}
        ${d.docker_containers?.length ? `
        <div class="card">
            <h2>🐳 Docker контейнеры</h2>
            ${d.docker_containers.map(c => row(c.name, `<span class="badge ${c.status === 'running' ? 'badge-success' : 'badge-info'}">${c.status}</span>${c.status === 'running' && c.uptime ? ` (${c.uptime})` : ''}`)).join('')}
        </div>` : ''}
        <div class="update-time">Обновлено: ${d.update_time} (${d.response_time} мс)</div>
    `;
    
    $('server-data').innerHTML = html;
    document.querySelectorAll('.metric-value').forEach(el => {
        el.classList.add('updating');
        setTimeout(() => el.classList.remove('updating'), 300);
    });
}

// Вспомогательные функции рендеринга
function row(label, value) {
    return `<div class="info-row"><div class="info-label">${label}:</div><div class="info-value">${value}</div></div>`;
}

function metric(value, label) {
    return `<div class="metric"><div class="metric-value">${value}</div><div class="metric-label">${label}</div></div>`;
}

// Автообновление
function startAuto() {
    if (timer) clearInterval(timer);
    if (C.realtime) timer = setInterval(fetchData, C.interval * 1000);
}

// Переключение режима
function setMode(realtime) {
    C.realtime = realtime;
    updateModeUI();
    save();
    startAuto();
    
    const manual = $('manual-update');
    if (!realtime && !manual) {
        const btn = document.createElement('button');
        btn.id = 'manual-update';
        btn.className = 'mode-btn';
        btn.innerHTML = '🔄 Обновить';
        btn.onclick = () => fetchData();
        $('mode-realtime').parentNode.appendChild(btn);
    } else if (manual && realtime) manual.remove();
}

// Смена интервала
function setInterval() {
    const val = +$('interval-input').value;
    if (val >= 1 && val <= 30) {
        C.interval = val;
        save();
        if (C.realtime) startAuto();
        updateModeUI();
    } else {
        alert('Интервал 1-30 сек');
        $('interval-input').value = C.interval;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    load();
    $('mode-realtime').onclick = () => setMode(true);
    $('mode-static').onclick = () => setMode(false);
    $('apply-interval').onclick = setInterval;
    fetchData();
    startAuto();
});
