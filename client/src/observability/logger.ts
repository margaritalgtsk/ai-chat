export type LogLevel = 'info' | 'warn' | 'error';

export const log = {
  debug(message: string, data?: Record<string, unknown>) {
    console.debug('[DEBUG]', message, data ?? {});
  },
  info(message: string, data?: Record<string, unknown>) {
    console.info('[INFO]', message, data ?? {});
  },
  warn(message: string, data?: Record<string, unknown>) {
    console.warn('[WARN]', message, data ?? {});
  },
  error(message: string, data?: Record<string, unknown>) {
    console.error('[ERROR]', message, data ?? {});
  },
};
