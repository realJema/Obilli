import { NextRequest, NextResponse } from 'next/server';
import { PaymentOperation, RandomGenerator } from '@hachther/mesomb';

// MeSomb API configuration - PRODUCTION MODE ONLY
const MESOMB_CONFIG = {
  appKey: process.env.MESOMB_APP_KEY,
  accessKey: process.env.MESOMB_ACCESS_KEY,
  secretKey: process.env.MESOMB_SECRET_KEY,
};

// Validate that all required environment variables are set
if (!MESOMB_CONFIG.appKey || !MESOMB_CONFIG.accessKey || !MESOMB_CONFIG.secretKey) {
  console.error('❌ MeSomb credentials not configured. Please set MESOMB_APP_KEY, MESOMB_ACCESS_KEY, and MESOMB_SECRET_KEY environment variables.');
}

export async function POST(request: NextRequest) {
  try {
    // Check if production credentials are configured
    if (!MESOMB_CONFIG.appKey || !MESOMB_CONFIG.accessKey || !MESOMB_CONFIG.secretKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MeSomb payment gateway is not configured. Please contact support.' 
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { amount, phone, service, reference, description } = body;

    // Validate required fields
    if (!amount || !phone || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, phone, service' },
        { status: 400 }
      );
    }

    // Format phone number for MeSomb (should be 9 digits without country code)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    
    // Remove country code if present
    if (formattedPhone.startsWith('237')) {
      formattedPhone = formattedPhone.substring(3);
    }
    
    // Ensure it's 9 digits
    if (formattedPhone.length !== 9) {
      return NextResponse.json(
        { success: false, error: `Invalid phone number format. Expected 9 digits, got ${formattedPhone.length}` },
        { status: 400 }
      );
    }


    try {
      // Initialize PaymentOperation with credentials
      const paymentConfig = {
        applicationKey: MESOMB_CONFIG.appKey,
        accessKey: MESOMB_CONFIG.accessKey,
        secretKey: MESOMB_CONFIG.secretKey,
      };
      
      // Production mode only - no test mode configuration
      
      const paymentOperation = new PaymentOperation(paymentConfig);

      // Use MeSomb SDK to make payment
      const collectRequest = {
        amount: amount,
        service: service,
        payer: formattedPhone,
        nonce: RandomGenerator.nonce(),
        currency: 'XAF',
        country: 'CM',
        fees: true,
        message: description || 'Payment for boost',
        reference: reference || `boost_${Date.now()}`
      };
      
      const response = await paymentOperation.makeCollect(collectRequest);

      if (response.isOperationSuccess()) {
        return NextResponse.json({
          success: true,
          transactionId: response.reference,
          status: response.status,
          message: response.message,
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: response.message || 'Payment failed',
            status: response.status,
            details: `MeSomb error: ${response.message || 'Unknown error'}`
          },
          { status: 400 }
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment request failed';
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if production credentials are configured
    if (!MESOMB_CONFIG.appKey || !MESOMB_CONFIG.accessKey || !MESOMB_CONFIG.secretKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MeSomb payment gateway is not configured. Please contact support.' 
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const service = searchParams.get('service');

    if (!transactionId || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing transactionId or service' },
        { status: 400 }
      );
    }

    try {
      // Initialize PaymentOperation with credentials
      const paymentConfig = {
        applicationKey: MESOMB_CONFIG.appKey,
        accessKey: MESOMB_CONFIG.accessKey,
        secretKey: MESOMB_CONFIG.secretKey,
      };
      
      // Production mode only - no test mode configuration
      
      const paymentOperation = new PaymentOperation(paymentConfig);

      // Use MeSomb SDK to check payment status
      // getTransactions returns an array, so we need to find the specific transaction
      const transactions = await paymentOperation.getTransactions([transactionId]);

      if (transactions && transactions.length > 0) {
        const transaction = transactions[0];
        return NextResponse.json({
          success: true,
          transactionId: transaction.reference || transactionId,
          status: transaction.status || 'UNKNOWN',
          message: transaction.message || 'Transaction found',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Transaction not found',
            status: 'NOT_FOUND',
          },
          { status: 404 }
        );
      }
    } catch (error: unknown) {
      console.error('MeSomb SDK status check error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Status check failed';
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
