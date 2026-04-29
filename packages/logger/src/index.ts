export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 99,
};

export interface LoggerOptions {
  level?: LogLevel;
  enabledModules?: string[];
}

export class FrontendLogger {
  private level: LogLevel;
  private enabledModules: string[];

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? 'info';
    this.enabledModules = options.enabledModules ?? ['*'];
  }

  debug(moduleName: string, message: string, data?: unknown) {
    this.print('debug', moduleName, message, data);
  }

  info(moduleName: string, message: string, data?: unknown) {
    this.print('info', moduleName, message, data);
  }

  warn(moduleName: string, message: string, data?: unknown) {
    this.print('warn', moduleName, message, data);
  }

  error(moduleName: string, message: string, data?: unknown) {
    this.print('error', moduleName, message, data);
  }

  time(moduleName: string, label: string) {
    if (!this.shouldLog('debug', moduleName)) return () => {};

    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(moduleName, `${label} finished`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  private shouldLog(level: LogLevel, moduleName: string): boolean {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) return false;
    return this.enabledModules.includes('*') || this.enabledModules.includes(moduleName);
  }

  private print(level: LogLevel, moduleName: string, message: string, data?: unknown) {
    if (!this.shouldLog(level, moduleName)) return;
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    const formatted = `[${timestamp}] [${moduleName}] ${message}`;
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(formatted, data ?? '');
  }
}

export const logger = new FrontendLogger();
