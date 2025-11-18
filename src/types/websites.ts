export type WebsiteStatus = 'draft' | 'published';

export interface WebsiteSummary {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  updatedAt: string;
}

export interface WebsiteDetails extends WebsiteSummary {
  contentJson: string;
  clientName?: string | null;
  clientEmail?: string | null;
  industry?: string | null;
  targetAudience?: string | null;
  seoMetadata?: string | null;
}

export interface CreateWebsiteRequest {
  clientName: string;
  clientEmail: string;
  clientWhatsapp?: string | null;
  clientSocials?: string | null;
  industry?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  brandColors?: string | null;
  style?: string | null;
  contentJson: string;
  seoMetadata?: string | null;
  slug?: string | null;
}

export interface GenerateWebsiteRequest {
  clientName: string;
  clientEmail: string;
  clientWhatsapp?: string | null;
  clientSocials?: string | null;
  industry?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  brandColors?: string | null;
  style?: string | null;
  tone?: string | null;
  additionalContext?: string | null;
}

export interface ApplyPromptRequest {
  prompt: string;
  reasoningAdvanced?: boolean;
  targetElementId?: string | null;
  expectedUpdatedAt: string;
}

export interface RevertWebsiteRequest {
  versionId?: string | null;
  expectedUpdatedAt: string;
}

export interface PublishWebsiteRequest {
  isPublished: boolean;
}

export interface UpdateWebsiteRequest {
  clientName?: string | null;
  clientEmail?: string | null;
  slug?: string | null;
  clientWhatsapp?: string | null;
  clientSocials?: string | null;
  industry?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  brandColors?: string | null;
  style?: string | null;
  contentJson?: string | null;
  seoMetadata?: string | null;
}
