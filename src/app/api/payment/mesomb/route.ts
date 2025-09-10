import { NextRequest, NextResponse } from 'next/server';
import { PaymentOperation, RandomGenerator } from '@hachther/mesomb';

// MeSomb API configuration
const MESOMB_CONFIG = {
  appKey: process.env.MESOMB_APP_KEY || '25eb2d514e1cb9ebbb9866792f25763164130eb5',
  accessKey: process.env.MESOMB_ACCESS_KEY || 'cb0adea9-4ed2-4e25-bf45-73c7f1b80e61',
  secretKey: process.env.MESOMB_SECRET_KEY || '1532a68f-5b88-4883-8200-946f9e090e7b',
};

export async function POST(request: NextRequest) {
  try {
    console.log('MeSomb API Route: POST request received');
    
    const body = await request.json();
    const { amount, phone, service, reference, description } = body;

    console.log('Payment request:', { amount, phone, service, reference, description });

    // Validate required fields
    if (!amount || !phone || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, phone, service' },
        { status: 400 }
      );
    }

    // Format phone number (remove 237 prefix if present)
    let formattedPhone = phone;
    if (phone.startsWith('237')) {
      formattedPhone = phone.substring(3);
    }

    console.log('Formatted phone number:', formattedPhone);

    try {
      // Initialize PaymentOperation with credentials
      const paymentOperation = new PaymentOperation({
        applicationKey: MESOMB_CONFIG.appKey,
        accessKey: MESOMB_CONFIG.accessKey,
        secretKey: MESOMB_CONFIG.secretKey,
      });

      // Use MeSomb SDK to make payment
      const response = await paymentOperation.makeCollect({
        amount: amount,
        service: service,
        payer: formattedPhone,
        nonce: RandomGenerator.nonce(),
        currency: 'XAF',
        fees: true,
        message: description || 'Payment for boost',
        reference: reference || `boost_${Date.now()}`,
      });

      console.log('MeSomb SDK response:', response);

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
          },
          { status: 400 }
        );
      }
    } catch (error: unknown) {
      console.error('MeSomb SDK error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment request failed';
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

export async function GET(request: NextRequest) {
  try {
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
      const paymentOperation = new PaymentOperation({
        applicationKey: MESOMB_CONFIG.appKey,
        accessKey: MESOMB_CONFIG.accessKey,
        secretKey: MESOMB_CONFIG.secretKey,
      });

      // Use MeSomb SDK to check payment status
      // getTransactions returns an array, so we need to find the specific transaction
      const transactions = await paymentOperation.getTransactions([transactionId]);

      console.log('MeSomb status check response:', transactions);

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
