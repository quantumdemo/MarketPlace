import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phone, isVoice } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone: remove spaces, +, and leading 0s if formatted like +234080...
    let cleanPhone = phone.replace(/[^0-9]/g, '');

    // Handle Nigerian phone numbers: if starting with 0, prepend 234
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = `234${cleanPhone.slice(1)}`;
    }

    const termiiApiKey = process.env.TERMII_API_KEY;
    const senderId = process.env.TERMII_SENDER_ID || 'N-Alert'; // 'N-Alert' is Termii's default approved sender ID

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (termiiApiKey) {
      const termiiEndpoint = isVoice
        ? 'https://api.ng.termii.com/api/sms/otp/send'
        : 'https://api.ng.termii.com/api/sms/send';

      const payload = isVoice
        ? {
            api_key: termiiApiKey,
            phone_number: cleanPhone,
            pin_attempts: 3,
            pin_time_to_live: 10,
            pin_length: 6,
            pin_placeholder: '< 1234 >',
            message_text: 'Your MechSource security code is < 1234 >. Valid for 10 minutes.'
          }
        : {
            api_key: termiiApiKey,
            to: cleanPhone,
            from: senderId,
            sms: `Your MechSource security verification code is: ${otpCode}. Valid for 5 minutes. Do not share with anyone.`,
            type: 'plain',
            channel: 'dnd' // 'dnd' or 'generic' ensures delivery to DND-registered Nigerian numbers
          };

      const res = await fetch(termiiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const termiiData = await res.json();

      if (!res.ok || termiiData.code === 'error' || termiiData.status === 'error') {
        console.warn('Termii API response warning:', termiiData);
        return NextResponse.json({
          success: false,
          error: termiiData.message || 'Failed to dispatch SMS via Termii. Please verify your TERMII_API_KEY and Sender ID.',
          details: termiiData
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        provider: 'Termii',
        message: 'OTP sent successfully',
        termiiResponse: termiiData
      });
    }

    // Development mode fallback
    return NextResponse.json({
      success: true,
      provider: 'Dev-Simulation',
      message: 'OTP simulation active. (Configure TERMII_API_KEY in .env.local for live SMS)',
      code: otpCode
    });

  } catch (error: any) {
    console.error('Send OTP route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
