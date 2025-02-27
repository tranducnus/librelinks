import React, { useEffect, useRef, useState } from 'react';
import { EmbedConfig } from '@/types/embed';
import ContentContainer from '../content-container';
import { AlertCircle, Instagram } from 'lucide-react';
import ErrorBoundary from '../../error-boundary';

interface InstagramContainerProps {
  embedHtml?: string;
  url: string;
  title: string;
  maxWidth?: string;
  config?: Partial<EmbedConfig>;
  className?: string;
}

const InstagramContainer: React.FC<InstagramContainerProps> = ({
  embedHtml,
  url,
  title,
  maxWidth = '540px',
  config,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadInstagramScript = () => {
      if (window.instgrm) {
        setIsScriptLoaded(true);
        window.instgrm.Embeds.process();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      scriptRef.current = script;
      document.body.appendChild(script);
    };

    loadInstagramScript();

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [embedHtml, isScriptLoaded]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Instagram-specific container class with overflow handling
  const instagramConfig = {
    ...config,
    containerClass: `instagram-embed-container w-full max-w-[540px] mx-auto overflow-hidden rounded-lg ${config?.containerClass || ''}`,
  };

  return (
    <ErrorBoundary>
      <div className="instagram-wrapper relative w-full h-full">
        <ContentContainer
          type="social"
          provider="Instagram"
          className={instagramConfig.containerClass}
        >
          {/* Instagram-specific wrapper for better mobile handling */}
          <div className="instagram-content-wrapper relative w-full h-full">
            <div className="instagram-embed-wrapper relative w-full h-full overflow-hidden">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <Instagram className="w-8 h-8 text-gray-400 animate-pulse" />
                    <p className="text-sm text-gray-500">
                      Loading Instagram content...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">Failed to load Instagram content</p>
                  </div>
                </div>
              )}

              {/* Instagram Content */}
              {embedHtml ? (
                <div
                  ref={containerRef}
                  className={`instagram-embed w-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  dangerouslySetInnerHTML={{ __html: embedHtml }}
                  onLoad={handleIframeLoad}
                  onError={handleError}
                />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm font-medium">{title}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </ContentContainer>
      </div>
    </ErrorBoundary>
  );
};

export default InstagramContainer;
