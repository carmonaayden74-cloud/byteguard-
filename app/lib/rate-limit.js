const lr = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const record = lr.get(ip) || { count: 0, startTime: now };

    if (now - record.startTime > windowMs) {
        record.count = 1;
        record.startTime = now;
    } else {
        record.count++;
    }

    lr.set(ip, record);
    return {
        success: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        reset: record.startTime + windowMs
    };
}
