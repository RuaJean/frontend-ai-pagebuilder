export interface PageContentBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  children?: PageContentBlock[];
}

export interface PageContentDocument {
  lang: string;
  version: number;
  blocks: PageContentBlock[];
}
