export interface HealthStatus {
  status: 'ok';
  uptime_seconds: number;
  timestamp: string;
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}
