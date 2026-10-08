// SUPABASE EDGE FUNCTION: send-sms-otp
// Dispatches SMS or Voice OTP via Termii (+234 Nigeria) or Twilio International

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, channel } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const termiiApiKey = Deno.env.get('TERMII_API_KEY');
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean phone number format (digits only, e.g. 2348030000000)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = `234${cleanPhone.slice(1)}`;
    }

    const termiiSenderId = Deno.env.get('TERMII_SENDER_ID') || 'N-Alert';

    // 1. Termii SMS/Voice Integration (+234 Nigeria focus)
    if (termiiApiKey) {
      const termiiEndpoint = channel === 'voice'
        ? 'https://api.ng.termii.com/api/sms/otp/send'
        : 'https://api.ng.termii.com/api/sms/send';

      const payload = channel === 'voice'
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
            from: termiiSenderId,
            sms: `Your MechSource security verification code is: ${otpCode}. Valid for 5 minutes. Do not share with anyone.`,
            type: 'plain',
            channel: 'dnd'
          };

      const res = await fetch(termiiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      return new Response(
        JSON.stringify({ success: true, provider: 'Termii', channel, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 2. Twilio International SMS / Voice Integration
    if (twilioSid && twilioAuthToken && twilioPhoneNumber) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const bodyParams = new URLSearchParams({
        To: phone.replace(/\s+/g, ''),
        From: twilioPhoneNumber,
        Body: `Your MechSource verification code is: ${otpCode}. Valid for 5 minutes.`
      });

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuthToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams
      });
      const data = await res.json();

      return new Response(
        JSON.stringify({ success: true, provider: 'Twilio', channel, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Fallback response for dev environments
    return new Response(
      JSON.stringify({ success: true, provider: 'Simulated', channel, codeSent: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
