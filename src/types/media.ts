export interface UploadMediaRequest {
  websiteId: string;
  file: File;
}

export interface MediaAsset {
  websiteId: string;
  filename: string;
  url: string;
  uploadedAt: string;
}
