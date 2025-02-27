import { useState, useEffect, useRef } from 'react';
import { EMBED_CONFIGS } from '@/config/embed';
import { RichMediaContent, EmbedConfig } from '@/types/embed';
import {
  InstagramContainer,
  YouTubeContainer,
  TwitterContainer,
  GenericContainer,
} from './embed-containers';

interface RichMediaPreviewProps {
  link: RichMediaContent;
  config?: Partial<EmbedConfig>;
  appearance?: 'minimal' | 'full';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    iframely: {
      load: () => void;
    };
    instgrm: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const RichMediaPreview = ({
  link,
  config,
  appearance = 'full',
  onLoad,
  onError,
  className,
  style,
}: RichMediaPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initializeCount = useRef(0);

  // Get provider config
  const providerConfig = EMBED_CONFIGS[link.provider] || EMBED_CONFIGS.Generic;
  const mergedConfig = { ...providerConfig, ...config };

  // Debug the incoming link data
  useEffect(() => {
    console.log('RichMediaPreview - Component mounted/updated with link:', {
      providerName: link.provider,
      hasEmbedHtml: !!link.embedHtml,
      scriptLoaded,
      isLoading,
    });
  }, [link, scriptLoaded, isLoading]);

  // Handle provider-specific script loading
  useEffect(() => {
    console.log('Script loading effect triggered:', {
      providerName: link.provider,
      hasScript: !!scriptRef.current,
    });

    // Don't reload if script is already loaded
    if (scriptRef.current || scriptLoaded) {
      console.log('Script already loaded, skipping');
      return;
    }

    const loadScript = () => {
      const scriptConfig = mergedConfig.script;
      if (!scriptConfig) {
        console.log('Loading Iframely script');
        const script = document.createElement('script');
        script.src = '//cdn.iframe.ly/embed.js';
        script.async = true;
        script.onload = () => {
          console.log('Iframely script loaded successfully');
          if (window.iframely) {
            window.iframely.load();
          }
          setScriptLoaded(true);
          setIsLoading(false);
        };
        script.onerror = () => {
          console.error('Failed to load Iframely script');
          setHasError(true);
          setErrorMessage('Failed to load preview service');
        };
        scriptRef.current = script;
        document.body.appendChild(script);
      } else {
        console.log('Loading provider script:', link.provider);
        const mainScript = document.createElement('script');
        mainScript.async = true;
        mainScript.src = scriptConfig.main;

        mainScript.onerror = () => {
          if (scriptConfig.fallback) {
            console.log('Main script failed, loading fallback');
            const fallbackScript = document.createElement('script');
            fallbackScript.src = scriptConfig.fallback;
            fallbackScript.async = true;
            fallbackScript.onload = () => {
              console.log('Fallback script loaded successfully');
              setScriptLoaded(true);
              setIsLoading(false);
            };
            fallbackScript.onerror = () => {
              console.error('Both main and fallback scripts failed');
              setHasError(true);
              setErrorMessage('Failed to load preview service');
            };
            scriptRef.current = fallbackScript;
            document.body.appendChild(fallbackScript);
          } else {
            setHasError(true);
            setErrorMessage('Failed to load preview service');
          }
        };

        mainScript.onload = () => {
          console.log('Main script loaded successfully');
          setScriptLoaded(true);
          setIsLoading(false);
        };

        scriptRef.current = mainScript;
        document.body.appendChild(mainScript);
      }
    };

    loadScript();

    return () => {
      if (scriptRef.current) {
        console.log('Cleaning up script');
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [link.provider, mergedConfig.script]);

  // Initialize embeds when content changes or script loads
  useEffect(() => {
    if (!scriptLoaded) {
      console.log('Script not loaded yet, skipping initialization');
      return;
    }

    initializeCount.current += 1;
    console.log('Initializing embed:', {
      count: initializeCount.current,
      providerName: link.provider,
      hasEmbedHtml: !!link.embedHtml,
    });

    // Only reset loading state on first initialization
    if (initializeCount.current === 1) {
      setIsLoading(true);
    }

    // Initialize appropriate embed
    if (link.provider === 'Instagram' && window.instgrm) {
      console.log('Processing Instagram embed');
      window.instgrm.Embeds.process();
    } else if (window.iframely) {
      console.log('Processing Iframely embed');
      window.iframely.load();
    }

    // Set loading to false after initialization
    const timer = setTimeout(() => {
      console.log('Setting loading to false after initialization');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [link.embedHtml, scriptLoaded]);

  // Early return if no embed data
  if (
    !link.embedHtml &&
    (!link.thumbnails ||
      !Array.isArray(link.thumbnails) ||
      link.thumbnails.length === 0)
  ) {
    console.log('RichMediaPreview - No preview content available');
    return null;
  }

  const handleIframeError = (event: React.SyntheticEvent<HTMLDivElement>) => {
    setHasError(true);
    setIsLoading(false);
    setErrorMessage('Failed to load embedded content');
    onError?.(new Error('Failed to load embedded content'));
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);
    setErrorMessage('Failed to load image');
    onError?.(new Error('Failed to load image'));
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setIsLoading(false);
    onLoad?.();
  };

  // Get the first valid thumbnail URL
  const thumbnailUrl =
    link.thumbnails &&
    Array.isArray(link.thumbnails) &&
    link.thumbnails.length > 0
      ? link.thumbnails[0].href || link.thumbnails[0].url
      : null;

  // Process HTML if needed
  const processedHtml =
    link.embedHtml && mergedConfig.processHtml
      ? mergedConfig.processHtml(link.embedHtml)
      : link.embedHtml;

  // Render content based on provider
  const renderContent = () => {
    const content = processedHtml ? (
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
        onError={handleIframeError}
      />
    ) : thumbnailUrl ? (
      <img
        src={thumbnailUrl}
        alt={link.title || 'Content preview'}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    ) : null;

    switch (link.provider) {
      case 'Instagram':
        return (
          <InstagramContainer
            config={mergedConfig}
            isLoading={isLoading}
            hasError={hasError}
          >
            <div className="instagram-embed-scaling w-full h-full">
              {content}
            </div>
          </InstagramContainer>
        );
      case 'YouTube':
        return (
          <YouTubeContainer
            config={mergedConfig}
            isLoading={isLoading}
            hasError={hasError}
          >
            {content}
          </YouTubeContainer>
        );
      case 'Twitter':
        return (
          <TwitterContainer
            config={mergedConfig}
            isLoading={isLoading}
            hasError={hasError}
          >
            {content}
          </TwitterContainer>
        );
      default:
        return (
          <GenericContainer
            config={mergedConfig}
            isLoading={isLoading}
            hasError={hasError}
          >
            {content}
          </GenericContainer>
        );
    }
  };

  return (
    <div className={className} style={style}>
      {renderContent()}
      {link.iframelyMeta?.description && !hasError && !isLoading && (
        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {link.iframelyMeta.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default RichMediaPreview;
