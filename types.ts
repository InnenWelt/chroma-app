
export interface ColorPaletteItem {
  name: string;
  hex: string;
}

// Updated: Now a simple string as the backend returns an array of strings
export type ZalandoQuery = string;

export interface AnalysisResult {
  analysis_id?: string;
  user_analysis: string;
  season_type?: string;
  description_premium?: string;
  color_palette: ColorPaletteItem[];
  zalando_search_queries?: ZalandoQuery[];
}

export interface FilterSettings {
  gender: string;
  occasion: string;
  budget: string;
  vibe: string;
  season: string;
  fit: string;
  categories: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  ANALYSIS_COMPLETE = 'ANALYSIS_COMPLETE',
  FINDING_OUTFITS = 'FINDING_OUTFITS',
  ERROR = 'ERROR'
}
