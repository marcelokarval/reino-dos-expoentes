const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 99,
};

function getDebugParams() {
  const params = new URLSearchParams(window.location.search);
  const debug = params.get('debug');
  const debugModules = params.get('debugModules');
  const enabled = ['true', '1', 'debug', 'info', 'warn', 'error'].includes(debug);
  const forcedLevel = ['debug', 'info', 'warn', 'error'].includes(debug)
    ? debug
    : enabled
      ? 'debug'
      : undefined;
  const forcedModules = debugModules
    ? debugModules.split(',').map((moduleName) => moduleName.trim()).filter(Boolean)
    : undefined;

  return { enabled, forcedLevel, forcedModules };
}

const debugParams = getDebugParams();
const loggerConfig = {
  level: debugParams.forcedLevel || window.REINO_LOG_LEVEL || 'info',
  enabledModules: debugParams.forcedModules || window.REINO_LOG_MODULES || ['*'],
  debugQueryEnabled: debugParams.enabled,
};

function isModuleEnabled(moduleName) {
  return loggerConfig.enabledModules.includes('*') || loggerConfig.enabledModules.includes(moduleName);
}

function shouldLog(level, moduleName) {
  if (LOG_LEVELS[level] < LOG_LEVELS[loggerConfig.level]) return false;
  return isModuleEnabled(moduleName);
}

function normalizeArgs(first, second, third) {
  if (typeof second === 'string') {
    return { module: first, message: second, data: third };
  }

  return {
    module: typeof third === 'string' ? third : 'App',
    message: first,
    data: second,
  };
}

class FrontendLogger {
  formatMessage(moduleName, message) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    return `[${timestamp}] [${moduleName}] ${message}`;
  }

  getStyle(level) {
    switch (level) {
      case 'debug':
        return 'color: gray; font-weight: normal;';
      case 'info':
        return 'color: dodgerblue; font-weight: bold;';
      case 'warn':
        return 'color: darkorange; font-weight: bold;';
      case 'error':
        return 'color: crimson; font-weight: bold; background: mistyrose; padding: 2px 4px; border-radius: 2px;';
      default:
        return 'color: inherit;';
    }
  }

  print(level, moduleName, message, data) {
    if (!shouldLog(level, moduleName)) return;

    const formattedMessage = this.formatMessage(moduleName, message);
    const style = this.getStyle(level);

    if (data !== undefined) {
      console.groupCollapsed(`%c${formattedMessage}`, style);
      console.log(data);
      console.groupEnd();
      return;
    }

    console.log(`%c${formattedMessage}`, style);
  }

  debug(...args) {
    const { module, message, data } = normalizeArgs(args[0], args[1], args[2]);
    this.print('debug', module, message, data);
  }

  trace(...args) {
    this.debug(...args);
  }

  info(...args) {
    const { module, message, data } = normalizeArgs(args[0], args[1], args[2]);
    this.print('info', module, message, data);
  }

  warn(...args) {
    const { module, message, data } = normalizeArgs(args[0], args[1], args[2]);
    this.print('warn', module, message, data);
  }

  error(...args) {
    if (typeof args[1] === 'string') {
      this.print('error', args[0], args[1], args[2]);
      return;
    }

    const [message, error, context, component] = args;
    const errorContext = {
      ...(context || {}),
      ...(error && {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : undefined,
      }),
    };

    this.print('error', component || 'App', message, errorContext);
  }

  time(moduleName, label) {
    if (!shouldLog('debug', moduleName)) return () => {};

    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(moduleName, `${label} finished`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  group(moduleName, label, collapsed = true) {
    if (!shouldLog('info', moduleName)) return { end: () => {} };

    const formattedMessage = this.formatMessage(moduleName, label);
    const style = 'color: rebeccapurple; font-weight: bold;';
    if (collapsed) {
      console.groupCollapsed(`%c${formattedMessage}`, style);
    } else {
      console.group(`%c${formattedMessage}`, style);
    }

    return { end: () => console.groupEnd() };
  }
}

window.logger = new FrontendLogger();
