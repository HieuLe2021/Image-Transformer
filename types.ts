
export interface GeneratedImageResult {
  imageUrl: string;
  text: string;
}

export interface PromptTemplate {
  title: string;
  prompt: string;
}

export interface PromptTemplateGroup {
  groupTitle: string;
  templates: PromptTemplate[];
}
