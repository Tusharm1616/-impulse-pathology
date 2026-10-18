// Frontend/src/lib/siteConfig.ts

export const LAB_NAME = "Impulse Pathology Laboratory";

// Character-for-character real address
export const LAB_ADDRESS = "Laxmi Chowk, Marunji Road, Near Gurukrupa Hospital, Pune, Maharashtra – 411057";

// Phone configuration
export const LAB_PHONE_RAW = "9373253743";
export const LAB_PHONE_DISPLAY = "+91 93732 53743";
export const LAB_PHONE_TEL = "tel:+919373253743";

// Email configuration
export const LAB_EMAIL = "impulsepathologylaboratory@gmail.com";
export const LAB_EMAIL_MAILTO = "mailto:impulsepathologylaboratory@gmail.com";

// WhatsApp configuration with prefilled enquiry message
export const LAB_WHATSAPP_MESSAGE = "Hello Impulse Pathology Laboratory, I would like to enquire about a test.";
export const LAB_WHATSAPP_URL = `https://wa.me/919373253743?text=${encodeURIComponent(LAB_WHATSAPP_MESSAGE)}`;

// Google Maps links
export const LAB_MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Impulse Pathology Laboratory, Laxmi Chowk, Marunji Road, Near Gurukrupa Hospital, Pune, Maharashtra – 411057")}`;
export const LAB_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent("Impulse Pathology Laboratory, Laxmi Chowk, Marunji Road, Near Gurukrupa Hospital, Pune 411057")}&output=embed`;

// Working hours
export const LAB_HOURS = "Open 24 Hours, 7 Days a Week";
export const LAB_WORKING_HOURS = LAB_HOURS;
