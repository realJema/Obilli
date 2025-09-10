// MeSomb API configuration - using the same structure as your Flutter app
const MESOMB_CONFIG = {
  appKey: process.env.NEXT_PUBLIC_MESOMB_APP_KEY || '25eb2d514e1cb9ebbb9866792f25763164130eb5',
  accessKey: process.env.NEXT_PUBLIC_MESOMB_ACCESS_KEY || 'cb0adea9-4ed2-4e25-bf45-73c7f1b80e61',
  secretKey: process.env.NEXT_PUBLIC_MESOMB_SECRET_KEY || '1532a68f-5b88-4883-8200-946f9e090e7b',
};

// MeSomb API base URL - using the same URL as your Flutter app
const MESOMB_API_URL = process.env.NEXT_PUBLIC_MESOMB_API_URL || 'https://mesomb.hachther.com/en/api/v1.1';

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
      console.log('MeSomb Service: Making payment request:', request);
      
      // Use our API route to avoid CORS issues
      const response = await fetch('/api/payment/mesomb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          phone: request.phone,
          service: request.service,
          reference: request.reference,
          description: request.description
        })
      });

      console.log('MeSomb Service: API response status:', response.status);

      const result = await response.json();
      console.log('MeSomb Service: API response body:', result);

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

    } catch (error: any) {
      console.error('MeSomb payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed. Please try again.'
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

    } catch (error: any) {
      console.error('MeSomb status check error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check payment status.'
      };
    }
  }

  private formatPhoneNumber(phone: string, service: 'mtn' | 'orange'): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (service === 'mtn') {
      // MTN Cameroon numbers start with 6
      if (cleaned.startsWith('6') && cleaned.length === 9) {
        return `237${cleaned}`;
      } else if (cleaned.startsWith('2376') && cleaned.length === 12) {
        return cleaned;
      }
    } else if (service === 'orange') {
      // Orange Cameroon numbers start with 69 or 655-659
      if (cleaned.length === 9 && (cleaned.startsWith('69') || (cleaned.startsWith('65') && parseInt(cleaned[2]) >= 5))) {
        return `237${cleaned}`;
      } else if (cleaned.length === 12 && (cleaned.startsWith('23769') || (cleaned.startsWith('23765') && parseInt(cleaned[5]) >= 5))) {
        return cleaned;
      }
    }
    
    // Return as-is if already formatted or if we can't determine the format
    return cleaned;
  }

  public validatePhoneNumber(phone: string, service: 'mtn' | 'orange'): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
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
