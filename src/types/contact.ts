export type ContactFieldValue = string | null;

export interface ContactFormRequest {
  fields: Record<string, ContactFieldValue>;
  honeypot?: string | null;
  recaptchaToken?: string | null;
}
