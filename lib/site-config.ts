// Central place for this storefront's identity. Change the env vars per
// client rather than editing component code — same pattern as
// NEXT_PUBLIC_WHATSAPP_NUMBER.

export const siteConfig = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Ivie's Glow Corner",
  tagline: process.env.NEXT_PUBLIC_BUSINESS_TAGLINE || 'Skincare that actually works',
};
