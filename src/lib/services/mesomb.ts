// MeSomb API configuration - PRODUCTION MODE ONLY
const MESOMB_CONFIG = {
  appKey: process.env.NEXT_PUBLIC_MESOMB_APP_KEY,
  accessKey: process.env.NEXT_PUBLIC_MESOMB_ACCESS_KEY,
  secretKey: process.env.NEXT_PUBLIC_MESOMB_SECRET_KEY,
};

// Validate that all required environment variables are set
if (!MESOMB_CONFIG.appKey || !MESOMB_CONFIG.accessKey || !MESOMB_CONFIG.secretKey) {
  console.warn('⚠️ MeSomb credentials not configured. Please set NEXT_PUBLIC_MESOMB_APP_KEY, NEXT_PUBLIC_MESOMB_ACCESS_KEY, and NEXT_PUBLIC_MESOMB_SECRET_KEY environment variables.');
}


export interface PaymentRequest {
  amount: number;
  phone: string;
  service: 'MTN' | 'ORANGE';
  reference?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  message?: string;
  error?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  amount?: number;
  phone?: string;
  reference?: string;
}

export class MeSombService {
  private static instance: MeSombService;

  private constructor() {}

  public static getInstance(): MeSombService {
    if (!MeSombService.instance) {
      MeSombService.instance = new MeSombService();
    }
    return MeSombService.instance;
  }

  private getConfig() {
    return MESOMB_CONFIG;
  }

  private generateMeSombSignature(method: string, url: string, timestamp: number, nonce: string, body: string, secretKey: string): string {
    // MeSomb signature generation based on your Flutter implementation
    const uri = new URL(url);
    const host = uri.host;
    const path = uri.pathname;
    const queryString = uri.search.substring(1); // Remove the '?' prefix
    
    // Create canonical headers
    const canonicalHeaders = `host:${host}\nx-mesomb-date:${timestamp}\nx-mesomb-nonce:${nonce}`;
    
    // Create signed headers
    const signedHeaders = 'host;x-mesomb-date;x-mesomb-nonce';
    
    // Create hashed payload (simplified - in production use proper SHA1)
    const hashedPayload = this.simpleHash(body);
    
    // Create canonical request
    const canonicalRequest = `${method}\n${path}\n${queryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
    
    // Get the date in YYYYMMDD format
    const date = new Date(timestamp * 1000).toISOString().split('T')[0].replace(/-/g, '');
    
    // Create string to sign as per documentation
    const stringToSign = `HMAC-SHA1\n${timestamp}\n${date}/payment/mesomb_request\n${this.simpleHash(canonicalRequest)}`;
    
    // Create signature using HMAC SHA1 (simplified)
    return this.simpleHmac(stringToSign, secretKey);
  }

  private simpleHash(str: string): string {
    // Simplified hash function - in production use proper SHA1
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private simpleHmac(message: string, key: string): string {
    // Simplified HMAC - in production use proper HMAC-SHA1
    const combined = `${message}${key}`;
    return btoa(combined).replace(/[^a-zA-Z0-9]/g, '');
  }

  private generateNonce(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public async makePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Format phone number before sending
      const formattedPhone = this.formatPhoneNumber(request.phone);
      
      // Use our API route to avoid CORS issues
      const response = await fetch('/api/payment/mesomb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          phone: formattedPhone,
          service: request.service,
          reference: request.reference,
          description: request.description
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        transactionId: result.transactionId,
        status: result.status,
        message: result.message
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  public async checkPaymentStatus(transactionId: string, service: 'mtn' | 'orange'): Promise<PaymentResponse> {
    try {
      // Use our API route to avoid CORS issues
      const response = await fetch(`/api/payment/mesomb?transactionId=${transactionId}&service=${service}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        transactionId: result.transactionId,
        status: result.status,
        message: result.message
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check payment status.';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Always add 237 prefix if not present
    if (cleaned.startsWith('237')) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return `237${cleaned}`;
    }
    
    // Return as-is if we can't determine the format
    return cleaned;
  }

  public validatePhoneNumber(phone: string, service: 'mtn' | 'orange'): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
    // Production mode - no test numbers accepted
    
    if (service === 'mtn') {
      // MTN: 6XXXXXXXX (9 digits) or 2376XXXXXXXX (12 digits)
      // MTN uses 67, 68, and 650-654 prefixes
      return (cleaned.startsWith('6') && cleaned.length === 9) || 
             (cleaned.startsWith('2376') && cleaned.length === 12);
    } else if (service === 'orange') {
      // Orange Cameroon: 69X or 655-659 (9 digits) or 23769X or 237655-659 (12 digits)
      // Orange uses 69X and 655-659 prefixes
      const isOrange9Digit = cleaned.length === 9 && (
        cleaned.startsWith('69') || 
        (cleaned.startsWith('65') && parseInt(cleaned[2]) >= 5)
      );
      const isOrange12Digit = cleaned.length === 12 && (
        cleaned.startsWith('23769') || 
        (cleaned.startsWith('23765') && parseInt(cleaned[5]) >= 5)
      );
      return isOrange9Digit || isOrange12Digit;
    }
    
    return false;
  }

  public async pollPaymentStatus(
    transactionId: string, 
    service: 'mtn' | 'orange', 
    maxAttempts: number = 30, 
    intervalMs: number = 2000
  ): Promise<PaymentStatus> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const statusResponse = await this.checkPaymentStatus(transactionId, service);
        
        if (statusResponse.success && statusResponse.status) {
          const status = statusResponse.status as 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
          
          // If payment is no longer pending, return the final status
          if (status !== 'PENDING') {
            return {
              transactionId,
              status,
              amount: undefined,
              phone: undefined,
              reference: transactionId
            };
          }
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
        
      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        
        // If we've exhausted attempts, return failed status
        if (attempts >= maxAttempts) {
          return {
            transactionId,
            status: 'FAILED'
          };
        }
      }
    }
    
    // Timeout - return pending status
    return {
      transactionId,
      status: 'PENDING'
    };
  }
}

// Export singleton instance
export const mesombService = MeSombService.getInstance();
