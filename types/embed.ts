export type EmbedType = 'video' | 'photo' | 'rich' | 'link' | 'playlist';
export type ProviderName =
  | 'Instagram'
  | 'YouTube'
  | 'Twitter'
  | 'TikTok'
  | 'Spotify'
  | 'Generic';

export interface ScriptConfig {
  main: string;
  fallback?: string;
  global?: string; // Global variable to check for script loaded state
}

export interface AspectRatioConfig {
  mobile: string;
  tablet?: string;
  desktop?: string;
}

export interface ContainerConfig {
  className: string;
  style?: Record<string, string>;
}

export interface EmbedConfig {
  aspectRatio: AspectRatioConfig;
  containerClass: string;
  script?: ScriptConfig;
  processHtml?: (html: string) => string;
}

// Using Record type for provider configuration mapping
export type EmbedProviderConfig = Record<ProviderName, EmbedConfig>;

export interface RichMediaContent {
  type: EmbedType;
  provider: ProviderName;
  html?: string;
  embedHtml?: string; // Used for embedded content
  url?: string;
  thumbnail?: string;
  thumbnails?: Array<{ href?: string; url?: string }>;
  title?: string;
  description?: string;
  author?: string;
  authorUrl?: string;
  metadata?: Record<string, any>;
  iframelyMeta?: Record<string, any>; // Used for iframely metadata
}

export interface RichMediaPreviewProps {
  content: RichMediaContent;
  config?: Partial<EmbedConfig>;
  appearance?: 'minimal' | 'full';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Utility type helpers
export type ProcessHtmlFunction = (html: string) => string;

// Container component props
export interface EmbedContainerProps {
  config?: Partial<EmbedConfig>;
  children: React.ReactNode;
  isLoading?: boolean;
  hasError?: boolean;
}

export interface ProviderContainerProps extends EmbedContainerProps {
  url?: string;
  title?: string;
  maxWidth?: string;
  className?: string;
  metadata?: {
    processed?: {
      type?: string;
      html?: string;
    };
  };
}

// Constants
export const DEFAULT_ASPECT_RATIO: AspectRatioConfig = {
  mobile: 'aspect-video',
  tablet: 'aspect-video',
  desktop: 'aspect-video',
};

export const DEFAULT_CONTAINER_CLASS =
  'w-full h-full overflow-hidden rounded-lg bg-gray-50';
