import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two-factor authentication code",
    text: `Your two-factor authentication code is ${token}`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const emailHtmlPasswordReset = `
      <div class="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div class="text-center mb-6">
          <img src="https://yourlogo.com/logo.png" alt="Company Logo" class="mx-auto h-12 w-auto">
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Reset Your Password</h2>
        <p class="mt-4 text-gray-600">Hi there,</p>
        <p class="mt-2 text-gray-600">We received a request to reset your password. Click the button below to set a new password.</p>
        <div class="mt-6 text-center">
          <a href="${resetLink}" class="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-600">Reset Password</a>
        </div>
        <p class="mt-6 text-gray-600">If you did not request a password reset, please ignore this email.</p>
        <p class="mt-6 text-gray-600">Best regards,<br>Your Company Name</p>
        <hr class="my-6 border-gray-200">
        <p class="text-sm text-gray-500 text-center">This email was sent to ${email}. If you have any questions, please contact support.</p>
      </div>
    `;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: emailHtmlPasswordReset,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const emailHtmlEmailVerification = `
  <div class="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
    <div class="text-center mb-6">
      <img src="https://yourlogo.com/logo.png" alt="Company Logo" class="mx-auto h-12 w-auto">
    </div>
    <h2 class="text-2xl font-bold text-gray-900">Confirm Your Email Address</h2>
    <p class="mt-4 text-gray-600">Hi there,</p>
    <p class="mt-2 text-gray-600">Thank you for signing up. Please confirm your email address by clicking the button below.</p>
    <div class="mt-6 text-center">
      <a href="${confirmLink}" class="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-600">Confirm Email</a>
    </div>
    <p class="mt-6 text-gray-600">If you did not sign up for this account, please ignore this email.</p>
    <p class="mt-6 text-gray-600">Best regards,<br>Your Company Name</p>
    <hr class="my-6 border-gray-200">
    <p class="text-sm text-gray-500 text-center">This email was sent to ${email}. If you have any questions, please contact support.</p>
  </div>`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Please confirm your email",
    html: emailHtmlEmailVerification,
  });
};
