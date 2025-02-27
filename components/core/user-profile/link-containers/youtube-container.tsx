import React, { useEffect, useRef, useState } from 'react';
import { EmbedConfig } from '@/types/embed';
import ContentContainer from '../content-container';
import { AlertCircle, Youtube } from 'lucide-react';
import ErrorBoundary from '../../error-boundary';

interface YouTubeContainerProps {
  embedHtml?: string;
  url: string;
  title: string;
  maxWidth?: string;
  config?: Partial<EmbedConfig>;
  className?: string;
}

declare global {
  interface Window {
    YT: {
      Player: any;
      ready: (callback: () => void) => void;
    };
  }
}

const YouTubeContainer: React.FC<YouTubeContainerProps> = ({
  embedHtml,
  url,
  title,
  maxWidth = '560px',
  config,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const playerRef = useRef<any>(null);

  // Extract video ID from URL
  const getVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    const loadYouTubeScript = () => {
      if (window.YT) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onload = () => {
        window.YT.ready(() => {
          setIsScriptLoaded(true);
        });
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      scriptRef.current = script;
      document.body.appendChild(script);
    };

    loadYouTubeScript();

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && !embedHtml) {
      const videoId = getVideoId(url);
      if (!videoId) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: () => setIsLoading(false),
            onError: () => {
              setHasError(true);
              setIsLoading(false);
            },
          },
        });
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    } else if (isScriptLoaded && embedHtml) {
      setIsLoading(false);
    }
  }, [embedHtml, isScriptLoaded, url]);

  return (
    <ErrorBoundary>
      <ContentContainer
        type="embed"
        maxWidth={{
          mobile: '100%',
          tablet: maxWidth,
          desktop: maxWidth,
        }}
        className={className}
      >
        <div
          ref={containerRef}
          className="relative w-full aspect-video overflow-hidden"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <Youtube className="w-8 h-8 text-gray-400 animate-pulse" />
                <p className="text-sm text-gray-500">
                  Loading YouTube video...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">Failed to load YouTube video</p>
              </div>
            </div>
          )}

          {/* YouTube Content */}
          {embedHtml && (
            <div
              className={`youtube-embed w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              dangerouslySetInnerHTML={{ __html: embedHtml }}
            />
          )}

          {/* Fallback */}
          {!embedHtml && hasError && (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Youtube className="w-5 h-5" />
                <span className="text-sm font-medium">{title}</span>
              </a>
            </div>
          )}
        </div>
      </ContentContainer>
    </ErrorBoundary>
  );
};

export default YouTubeContainer;
