// Security monitoring and logging utilities

interface SecurityEvent {
  type: string;
  timestamp: number;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 100;

  logEvent(type: string, details: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical' = 'low') {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      details,
      severity
    };

    this.events.push(event);

    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log high/critical events to console
    if (severity === 'high' || severity === 'critical') {
      console.warn(`[SECURITY ${severity.toUpperCase()}]`, type, details);
    }

    // In production, send to monitoring service
    if (severity === 'critical') {
      this.alertCriticalEvent(event);
    }
  }

  private alertCriticalEvent(event: SecurityEvent) {
    // In production, this would send to your monitoring service
    console.error('[CRITICAL SECURITY EVENT]', event);
  }

  // Log suspicious API usage
  logApiUsage(endpoint: string, response: Response) {
    if (!response.ok) {
      this.logEvent('api_error', {
        endpoint,
        status: response.status,
        statusText: response.statusText
      }, response.status >= 400 ? 'medium' : 'low');
    }
  }

  // Log invalid input attempts
  logInvalidInput(inputType: string, value: string) {
    this.logEvent('invalid_input', {
      inputType,
      value: value.substring(0, 50) // Truncate for privacy
    }, 'medium');
  }

  // Log wallet connection events
  logWalletEvent(eventType: string, address?: string) {
    this.logEvent('wallet_event', {
      eventType,
      address: address ? address.substring(0, 10) + '...' : undefined
    }, 'low');
  }

  // Get recent security events
  getRecentEvents(limit = 20): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  // Check for suspicious patterns
  detectSuspiciousActivity(): string[] {
    const warnings: string[] = [];
    const recentEvents = this.getRecentEvents(50);
    
    // Check for too many failed API calls
    const apiErrors = recentEvents.filter(e => e.type === 'api_error');
    if (apiErrors.length > 10) {
      warnings.push('High number of API errors detected');
    }

    // Check for invalid input attempts
    const invalidInputs = recentEvents.filter(e => e.type === 'invalid_input');
    if (invalidInputs.length > 5) {
      warnings.push('Multiple invalid input attempts detected');
    }

    return warnings;
  }
}

export const securityMonitor = new SecurityMonitor();

// Security middleware for API calls
export const secureApiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Add security headers
    const secureOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache'
      }
    };

    const response = await fetch(url, secureOptions);
    
    // Log the API usage
    securityMonitor.logApiUsage(url, response);
    
    return response;
  } catch (error) {
    securityMonitor.logEvent('api_call_failed', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'medium');
    throw error;
  }
};
