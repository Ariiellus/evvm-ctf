# Magic Link Setup Instructions

This project now uses Magic Link for passwordless email authentication instead of the previous hardcoded OTC implementation.

## Setup Steps

### 1. Get Your Magic API Key

1. Go to [Magic Dashboard](https://dashboard.magic.link/)
2. Sign up or log in to your account
3. Create a new app or select an existing one
4. Copy your **Publishable API Key**

### 2. Configure Environment Variables

Add your Magic API key to your `.env` file:

```bash
NEXT_PUBLIC_MAGIC_API_KEY=pk_live_YOUR_API_KEY_HERE
```

For development/testing, you can use Magic's Test Mode:

```bash
# Test Mode (optional - for local development)
NEXT_PUBLIC_MAGIC_API_KEY=pk_test_YOUR_TEST_API_KEY_HERE
```

### 3. Test Mode (Development Only)

Magic SDK provides Test Mode for local testing without sending real emails:

**Test emails that work in Test Mode:**
- `test+success@magic.link` - Simulates successful authentication
- `test+fail@magic.link` - Simulates failed authentication
- `test+fail_with_{ERROR_CODE}@magic.link` - Simulates specific errors

Example:
```javascript
// Use test email during development
await loginWithMagicLink('test+success@magic.link');
```

**Note:** Enable Test Mode by adding `testMode: true` to the Magic SDK constructor in `src/hooks/useMagic.ts`:

```typescript
const magicInstance = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
  testMode: true, // Add this line for testing
  network: {
    rpcUrl: "https://arbitrum-sepolia.therpc.io",
    chainId: 421614,
  },
});
```

### 4. How It Works

**Previous Implementation (Hardcoded OTC):**
- Generated a random 6-digit code
- Displayed it in an alert (simulated)
- User manually entered the code to verify

**New Implementation (Magic Link):**
1. User enters their email address
2. User clicks "Send Magic Link" button
3. Magic sends an email with a secure link
4. User clicks the link in their email
5. Magic verifies the authentication
6. User is automatically authenticated in the app

### 5. Features

- **Passwordless Authentication:** No passwords to remember or manage
- **Email Verification:** Ensures email ownership
- **Secure:** Uses DID (Decentralized Identifier) tokens
- **User-Friendly:** One-click authentication via email link
- **Error Handling:** Comprehensive error messages for common issues:
  - Magic link expired
  - Magic link failed verification
  - Rate limiting
  - Already logged in

### 6. Security Notes

#### IP Address Verification
Magic implements IP address verification to ensure the device that requests the magic link matches the device that clicks it. This prevents unauthorized access attempts.

#### Session Management
- Magic links authenticate the browser/tab where the link is clicked
- The session where the email was entered will receive authentication status
- Links expire after 15 minutes by default

### 7. Usage in EmailRegistrationComponent

The component now uses Magic Link authentication:

```typescript
import { useMagic, MagicRPCError, RPCErrorCode } from "@/hooks/useMagic";

// In your component
const { loginWithMagicLink, isLoggedIn, getUserEmail } = useMagic();

// Send magic link
const sendMagicLink = async () => {
  const didToken = await loginWithMagicLink(email, true);
  // didToken is the Decentralized ID token (15-minute lifespan)
};
```

### 8. Troubleshooting

**Magic SDK not initializing:**
- Ensure `NEXT_PUBLIC_MAGIC_API_KEY` is set in `.env`
- Verify the API key is correct
- Check browser console for errors

**Email not received:**
- Check spam folder
- Verify email address is correct
- Ensure you're not in Test Mode with a real email
- Check Magic Dashboard for delivery status

**Magic link expired:**
- Links expire after 15 minutes
- Request a new magic link

**Rate limited:**
- Wait a few minutes before trying again
- Magic has rate limits to prevent abuse

### 9. Production Deployment

For Vercel deployment, make sure to:

1. Add `NEXT_PUBLIC_MAGIC_API_KEY` to Vercel environment variables
2. Use your production Magic API key (not test key)
3. Configure your Magic app's allowed origins in the Magic Dashboard

### 10. Resources

- [Magic Documentation](https://docs.magic.link/)
- [Magic Links Guide](https://docs.magic.link/embedded-wallets/features/magic-links)
- [Magic Error Codes](https://docs.magic.link/embedded-wallets/sdk/client-side/javascript#error-codes)
- [Magic Dashboard](https://dashboard.magic.link/)
