<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

$startTime = microtime(true);

// ========== СТАТИСТИКА УНИКАЛЬНЫХ IP ==========
$stats_file = __DIR__ . '/data/unique_ips_stats.json';
$current_ip = $_SERVER['REMOTE_ADDR'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 'unknown';

// Загружаем существующую статистику
$stats = [];
if (file_exists($stats_file)) {
    $stats = json_decode(file_get_contents($stats_file), true);
    if (!is_array($stats)) $stats = [];
}

// Инициализация структуры
if (!isset($stats['total_unique_ips'])) $stats['total_unique_ips'] = [];
if (!isset($stats['daily'])) $stats['daily'] = [];
if (!isset($stats['hourly'])) $stats['hourly'] = [];

$today = date('Y-m-d');
$current_hour = date('Y-m-d H:00:00');

// Добавляем текущий IP в общую статистику
if (!in_array($current_ip, $stats['total_unique_ips'])) {
    $stats['total_unique_ips'][] = $current_ip;
}

// Дневная статистика
if (!isset($stats['daily'][$today])) {
    $stats['daily'][$today] = [];
}
if (!in_array($current_ip, $stats['daily'][$today])) {
    $stats['daily'][$today][] = $current_ip;
}

// Часовая статистика
if (!isset($stats['hourly'][$current_hour])) {
    $stats['hourly'][$current_hour] = [];
}
if (!in_array($current_ip, $stats['hourly'][$current_hour])) {
    $stats['hourly'][$current_hour][] = $current_ip;
}

// Очищаем старые данные (оставляем только последние 30 дней)
if (count($stats['daily']) > 30) {
    $dates = array_keys($stats['daily']);
    sort($dates);
    $oldest = array_shift($dates);
    unset($stats['daily'][$oldest]);
}

// Очищаем часовую статистику (оставляем последние 24 часа)
if (count($stats['hourly']) > 24) {
    $hours = array_keys($stats['hourly']);
    sort($hours);
    $oldest_hour = array_shift($hours);
    unset($stats['hourly'][$oldest_hour]);
}

// Сохраняем статистику
file_put_contents($stats_file, json_encode($stats, JSON_PRETTY_PRINT));

// Подсчеты
$total_unique_ips = count($stats['total_unique_ips']);
$today_unique_ips = isset($stats['daily'][$today]) ? count($stats['daily'][$today]) : 0;
$current_hour_unique_ips = isset($stats['hourly'][$current_hour]) ? count($stats['hourly'][$current_hour]) : 0;

// Получаем топ IP (последние посещения)
$recent_ips = array_slice(array_reverse($stats['total_unique_ips']), 0, 10);

// ========== ОСТАЛЬНАЯ СТАТИСТИКА ==========

// Базовые данные
$load = function_exists('sys_getloadavg') ? sys_getloadavg() : [0, 0, 0];

// Память
$memory = ['total' => 0, 'used' => 0, 'available' => 0];
if (file_exists('/proc/meminfo')) {
    $meminfo = file_get_contents('/proc/meminfo');
    preg_match('/MemTotal:\s+(\d+)/', $meminfo, $matches);
    $memory['total'] = round($matches[1] / 1024 / 1024, 2);
    preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $matches);
    $memory['available'] = round($matches[1] / 1024 / 1024, 2);
    $memory['used'] = round($memory['total'] - $memory['available'], 2);
}

// Диск
$disk_total = disk_total_space('/');
$disk_free = disk_free_space('/');
$disk_used = $disk_total - $disk_free;

// Uptime
$uptime = 'Недоступно';
if (file_exists('/proc/uptime')) {
    $seconds = floor(floatval(file_get_contents('/proc/uptime')));
    $days = floor($seconds / 86400);
    $hours = floor(($seconds % 86400) / 3600);
    $minutes = floor(($seconds % 3600) / 60);
    $uptime = "{$days} д, {$hours} ч, {$minutes} мин";
}

// Температура CPU
$temperature = null;
if (file_exists('/sys/class/thermal/thermal_zone0/temp')) {
    $temp = trim(file_get_contents('/sys/class/thermal/thermal_zone0/temp'));
    $temperature = round($temp / 1000, 1);
}

// Nginx статистика
$nginx_active = 0;
$nginx_accepts = 0;
$nginx_handled = 0;
$nginx_requests = 0;
if (function_exists('shell_exec')) {
    $status = shell_exec("curl -s http://127.0.0.1:8081/nginx_status 2>/dev/null");
    if (!$status) {
        $status = shell_exec("curl -s http://localhost/nginx_status 2>/dev/null");
    }
    if ($status && preg_match('/Active connections:\s+(\d+)/', $status, $m)) {
        $nginx_active = (int)$m[1];
    }
    if ($status && preg_match('/Accepts:\s+(\d+)\s+Handled:\s+(\d+)\s+Requests:\s+(\d+)/', $status, $m)) {
        $nginx_accepts = (int)$m[1];
        $nginx_handled = (int)$m[2];
        $nginx_requests = (int)$m[3];
    }
}

// Docker контейнеры
$docker_containers = [];
if (function_exists('shell_exec')) {
    $docker = shell_exec("docker ps --format '{{.Names}}|{{.Status}}' 2>/dev/null");
    if ($docker && trim($docker)) {
        foreach (explode("\n", trim($docker)) as $line) {
            if ($line && strpos($line, '|') !== false) {
                list($name, $status) = explode('|', $line, 2);
                $running = strpos($status, 'Up') !== false;
                $uptime_container = $running ? trim(str_replace('Up', '', $status)) : '';
                $docker_containers[] = [
                    'name' => trim($name),
                    'status' => $running ? 'running' : 'stopped',
                    'uptime' => $uptime_container
                ];
            }
        }
    }
}

// Открытые порты
$open_ports = [];
if (function_exists('shell_exec')) {
    $ports = shell_exec("ss -tulpn 2>/dev/null | grep LISTEN | awk '{print $5}' | grep -oE '[0-9]+$' | sort -n | uniq | head -20");
    if ($ports && trim($ports)) {
        $open_ports = array_unique(array_map('trim', explode("\n", trim($ports))));
    }
}

// Сетевой трафик
$traffic_in = 0;
$traffic_out = 0;
$total_rx = '0 MB';
$total_tx = '0 MB';
$rx_bytes = 0;
$tx_bytes = 0;

if (file_exists('/proc/net/dev')) {
    $dev = file('/proc/net/dev');
    foreach ($dev as $line) {
        if (preg_match('/eth0:|ens3:|enp0s3:/', $line)) {
            $parts = preg_split('/\s+/', trim($line));
            if (isset($parts[1]) && isset($parts[9])) {
                $rx_bytes = (int)$parts[1];
                $tx_bytes = (int)$parts[9];
                $total_rx = round($rx_bytes / 1024 / 1024, 2) . ' MB';
                $total_tx = round($tx_bytes / 1024 / 1024, 2) . ' MB';
                break;
            }
        }
    }
}

// Скорость трафика
$traffic_file = '/tmp/traffic_stats_' . md5(__FILE__);
if (file_exists($traffic_file)) {
    $old = @unserialize(file_get_contents($traffic_file));
    if ($old && isset($old['time'])) {
        $time_diff = time() - $old['time'];
        if ($time_diff > 0 && $time_diff < 60) {
            $traffic_in = round(($rx_bytes - $old['rx']) / 1024 / $time_diff, 2);
            $traffic_out = round(($tx_bytes - $old['tx']) / 1024 / $time_diff, 2);
        }
    }
}
@file_put_contents($traffic_file, serialize(['rx' => $rx_bytes, 'tx' => $tx_bytes, 'time' => time()]));

$responseTime = round((microtime(true) - $startTime) * 1000, 2);

// Форматируем числа до 2 знаков после запятой
$memory_total = number_format($memory['total'], 2, '.', '');
$memory_used = number_format($memory['used'], 2, '.', '');
$disk_total_formatted = number_format(round($disk_total / 1024 / 1024 / 1024, 2), 2, '.', '');
$disk_used_formatted = number_format(round($disk_used / 1024 / 1024 / 1024, 2), 2, '.', '');

echo json_encode([
    'success' => true,
    'response_time' => $responseTime,
    'hostname' => gethostname(),
    'server_ip' => $_SERVER['SERVER_ADDR'] ?? $_SERVER['LOCAL_ADDR'] ?? 'Не определен',
    'current_ip' => $current_ip,
    'server_time' => date('Y-m-d H:i:s'),
    'update_time' => date('H:i:s'),
    'uptime' => $uptime,
    'load_1min' => number_format($load[0], 2),
    'load_5min' => number_format($load[1], 2),
    'load_15min' => number_format($load[2], 2),
    'temperature' => $temperature,
    'nginx_active' => $nginx_active,
    'nginx_accepts' => number_format($nginx_accepts),
    'nginx_handled' => number_format($nginx_handled),
    'nginx_requests' => number_format($nginx_requests),
    'docker_containers' => $docker_containers,
    'open_ports' => $open_ports,
    'traffic_in' => max(0, $traffic_in),
    'traffic_out' => max(0, $traffic_out),
    'total_rx' => $total_rx,
    'total_tx' => $total_tx,
    'memory_total' => $memory_total,
    'memory_used' => $memory_used,
    'memory_used_percent' => $memory['total'] > 0 ? round(($memory['used'] / $memory['total']) * 100, 1) : 0,
    'disk_total' => $disk_total_formatted,
    'disk_used' => $disk_used_formatted,
    'disk_used_percent' => $disk_total > 0 ? round(($disk_used / $disk_total) * 100, 1) : 0,
    // Статистика уникальных IP
    'unique_ips' => [
        'total' => $total_unique_ips,
        'today' => $today_unique_ips,
        'current_hour' => $current_hour_unique_ips,
        'recent' => $recent_ips,
        'current' => $current_ip
    ]
]);
