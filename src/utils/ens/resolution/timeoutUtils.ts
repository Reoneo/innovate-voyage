
/**
 * Timeout and abort controller utilities
 */

/**
 * Setup abort controller with timeout
 */
export function setupTimeoutController(timeoutMs: number): {
  controller: AbortController;
  clear: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    console.warn(`Aborting operation after ${timeoutMs}ms`);
    controller.abort();
  }, timeoutMs);
  
  return {
    controller,
    clear: () => clearTimeout(timer)
  };
}

/**
 * First successful resolution from multiple methods
 */
export async function firstSuccessful<T>(methods: (() => Promise<T>)[]): Promise<T | null> {
  for (const method of methods) {
    try {
      const result = await method();
      if (result) return result;
    } catch (e) {
      console.warn('Method failed:', e);
    }
  }
  return null;
}
