import twilio from "twilio";
import { ENV } from "./env";

let twilioClient: any = null;

function getTwilioClient() {
  if (!ENV.twilioAccountSid || !ENV.twilioAuthToken) {
    console.warn("[SMS] Twilio credentials not configured");
    return null;
  }

  if (!twilioClient) {
    twilioClient = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  }

  return twilioClient;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const client = getTwilioClient();

    if (!client) {
      // Fallback to console logging for development
      console.log(`[SMS] (Development Mode) Sending SMS to ${phoneNumber}: ${message}`);
      return {
        success: true,
        messageId: `dev_${Date.now()}`,
      };
    }

    if (!ENV.twilioPhoneNumber) {
      console.error("[SMS] Twilio phone number not configured");
      return {
        success: false,
        error: "Twilio phone number not configured",
      };
    }

    const result = await client.messages.create({
      body: message,
      from: ENV.twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log(`[SMS] Message sent successfully to ${phoneNumber}. SID: ${result.sid}`);

    return {
      success: true,
      messageId: result.sid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[SMS] Failed to send SMS to ${phoneNumber}:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send OTP via SMS
 */
export async function sendOTPViaSMS(phoneNumber: string, otp: string): Promise<boolean> {
  const message = `Your MediVault OTP is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`;

  const result = await sendSMS(phoneNumber, message);

  return result.success;
}

/**
 * Send verification code via SMS
 */
export async function sendVerificationCodeViaSMS(phoneNumber: string, code: string): Promise<boolean> {
  const message = `Your MediVault verification code is: ${code}. This code expires in 15 minutes.`;

  const result = await sendSMS(phoneNumber, message);

  return result.success;
}

/**
 * Send notification via SMS
 */
export async function sendNotificationViaSMS(phoneNumber: string, notification: string): Promise<boolean> {
  const result = await sendSMS(phoneNumber, notification);

  return result.success;
}
