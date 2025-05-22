import { createThirdwebClient } from "thirdweb";

// Create a thirdweb client with proper configuration
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  secretKey: process.env.THIRDWEB_SECRET_KEY, // Add this for server-side authentication
}); 