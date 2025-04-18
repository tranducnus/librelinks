'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkCard from './links-card';
import TextCard from './text-card';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import arrows
import { useEffect, useRef, useState } from 'react';

// Define animation variants based on contentAnimation types
const animationVariants = {
  none: {
    initial: { opacity: 1, y: 0, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 1, y: 0, scale: 1 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: '50%' },
    animate: { opacity: 1, y: '0%' },
    exit: { opacity: 0, y: '-50%' }, // Exit upwards
  },
  slideDown: {
    initial: { opacity: 0, y: '-50%' },
    animate: { opacity: 1, y: '0%' },
    exit: { opacity: 0, y: '50%' }, // Exit downwards
  },
  slideLeft: {
    initial: { opacity: 0, x: '50%' },
    animate: { opacity: 1, x: '0%' },
    exit: { opacity: 0, x: '-50%' }, // Exit left
  },
  slideRight: {
    initial: { opacity: 0, x: '-50%' },
    animate: { opacity: 1, x: '0%' },
    exit: { opacity: 0, x: '50%' }, // Exit right
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -45, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 45, scale: 0.9 },
  },
  bounce: {
    initial: { opacity: 0, y: '30%', scale: 0.9 },
    animate: {
      opacity: 1,
      y: '0%',
      scale: 1,
      transition: { type: 'spring', stiffness: 150, damping: 15 },
    },
    exit: { opacity: 0, y: '30%', scale: 0.9 },
  },
};

// Styles for different positions
const cardPositions = {
  active: {
    zIndex: 30,
    scale: 1,
    y: '0%',
    opacity: 1,
    rotate: 0,
    filter: 'blur(0px)',
  },
  behind: {
    zIndex: 20,
    scale: 0.95,
    y: '3%',
    opacity: 0.6,
    rotate: -4,
    filter: 'blur(2px)',
  },
  farBehind: {
    zIndex: 10,
    scale: 0.9,
    y: '6%',
    opacity: 0.3,
    rotate: 4,
    filter: 'blur(4px)',
  },
  hidden: {
    zIndex: 0,
    scale: 0.85,
    y: '-100%',
    opacity: 0,
    filter: 'blur(0px)',
    pointerEvents: 'none',
  },
};

// Preload component to handle eager loading
const PreloadCard = React.memo(({ item, theme, fetchedUser }) => {
  if (!item?.url || !item.embedHtml) return null;

  return (
    <div
      className="sr-only"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '100%',
        height: 'auto',
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <LinkCard
        {...item}
        theme={theme}
        alwaysExpandEmbed={true}
        buttonStyle={fetchedUser?.buttonStyle}
        fontSize={fetchedUser?.linkTitleFontSize}
        fontFamily={fetchedUser?.linkTitleFontFamily}
        cardHeight={fetchedUser?.linkCardHeight}
        faviconSize={fetchedUser?.faviconSize}
      />
    </div>
  );
});

PreloadCard.displayName = 'PreloadCard';

// Enhanced MemoizedCard with multiple loading strategies
const MemoizedCard = React.memo(
  ({
    item,
    position,
    expandedState,
    toggleExpand,
    fetchedUser,
    theme,
    registerClicks,
    renderPhotoBook,
    contentAnimation,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadAttempts, setLoadAttempts] = useState(0);
    const cardRef = useRef(null);
    const timerRef = useRef(null);

    // Function to check if iframes are loaded
    const checkIframeLoad = () => {
      if (!cardRef.current) return false;
      const iframes = cardRef.current.querySelectorAll('iframe');
      return Array.from(iframes).every(iframe => {
        try {
          // Check if iframe has loaded its content
          return iframe.contentWindow && iframe.contentDocument;
        } catch (e) {
          // Cross-origin iframes will throw an error, assume they're loaded
          return true;
        }
      });
    };

    // Reset load state when position changes
    useEffect(() => {
      setIsLoaded(false);
      setLoadAttempts(0);
    }, [position]);

    // Multiple loading strategies
    useEffect(() => {
      if (!item?.url || !item.embedHtml) return;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const attemptLoad = () => {
        if (checkIframeLoad()) {
          setIsLoaded(true);
          return true;
        }
        return false;
      };

      // Strategy 1: Immediate check
      if (attemptLoad()) return;

      // Strategy 2: Multiple retries with increasing delays
      const retryLoad = () => {
        setLoadAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts < 5) {
            // Max 5 attempts
            const delay = Math.min(1000 * Math.pow(2, newAttempts), 5000); // Exponential backoff
            timerRef.current = setTimeout(retryLoad, delay);
          }
          return newAttempts;
        });
        attemptLoad();
      };

      // Start retry cycle
      timerRef.current = setTimeout(retryLoad, 500);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [item?.url, item?.embedHtml, position]);

    // Skip rendering for null items
    if (!item) return null;

    const cardStyle = cardPositions[position];

    return (
      <>
        {/* Preload instance */}
        {!isLoaded && position !== 'hidden' && (
          <PreloadCard item={item} theme={theme} fetchedUser={fetchedUser} />
        )}

        {/* Main card instance */}
        <motion.div
          ref={cardRef}
          animate={cardStyle}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute left-0 right-0 mx-auto top-0 w-full max-w-[calc(100%-40px)] h-auto select-none"
          style={{
            originX: 0.5,
            originY: 1,
          }}
        >
          <div className="relative w-full h-full rounded-xl border border-gray-200 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div className="w-full h-full">
              {item.type === 'photobook' ? (
                <div className="h-full w-full">{renderPhotoBook()}</div>
              ) : item.url ? (
                <LinkCard
                  {...item}
                  theme={theme}
                  fontSize={fetchedUser?.linkTitleFontSize}
                  fontFamily={fetchedUser?.linkTitleFontFamily}
                  buttonStyle={fetchedUser?.buttonStyle}
                  faviconSize={fetchedUser?.faviconSize ?? 32}
                  cardHeight={fetchedUser?.linkCardHeight}
                  alwaysExpandEmbed={expandedState || position !== 'active'} // Always expand if not active
                  toggleExpand={() => toggleExpand(item.id)}
                  registerClicks={
                    position === 'active'
                      ? () => registerClicks(item.id, item.url, item.title)
                      : undefined
                  }
                  contentAnimation={contentAnimation}
                  animationStyle={{
                    opacity: position === 'active' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              ) : (
                <TextCard
                  {...item}
                  theme={theme}
                  fontSize={fetchedUser?.linkTitleFontSize}
                  fontFamily={fetchedUser?.linkTitleFontFamily}
                  buttonStyle={fetchedUser?.textCardButtonStyle}
                  style={{
                    opacity: position === 'active' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.position === nextProps.position &&
      prevProps.expandedState === nextProps.expandedState &&
      prevProps.item.id === nextProps.item.id
    );
  }
);

MemoizedCard.displayName = 'MemoizedCard';

export function StackedCardsView({
  items = [],
  fetchedUser,
  theme,
  registerClicks,
  renderPhotoBook,
  contentAnimation,
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [expandedStates, setExpandedStates] = React.useState({});

  // Initialize expanded states on first render and when items change
  React.useEffect(() => {
    setExpandedStates(prev => {
      const newStates = { ...prev };
      items.forEach((item, index) => {
        if (newStates[item.id] === undefined) {
          newStates[item.id] =
            fetchedUser?.linkAlwaysExpandEmbed ||
            !!(item.embedHtml || (item.thumbnails && item.thumbnails.length > 0));
        }
      });
      return newStates;
    });
  }, [items, fetchedUser?.linkAlwaysExpandEmbed]);

  // Navigation handlers
  const handleNext = () => setActiveIndex(prev => (prev + 1) % items.length);
  const handlePrev = () => setActiveIndex(prev => (prev - 1 + items.length) % items.length);

  // Toggle handler for expanded state
  const handleToggleExpand = itemId => {
    setExpandedStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Don't render anything if no items
  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start p-4">
      {/* Navigation Buttons */}
      {items.length > 1 && (
        <div className="flex gap-4 w-full justify-center py-2 z-10">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow"
            aria-label="Previous Card"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow"
            aria-label="Next Card"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Card Container - All cards are rendered, position determines visibility */}
      <div className="relative w-full flex-grow flex items-center justify-center h-[calc(100%-60px)]">
        {items.map((item, index) => {
          // Skip null items
          if (!item) return null;

          // Determine position based on index relative to activeIndex
          let position = 'hidden';
          if (index === activeIndex) {
            position = 'active';
          } else if (index === (activeIndex + 1) % items.length) {
            position = 'behind';
          } else if (index === (activeIndex + 2) % items.length) {
            position = 'farBehind';
          }

          return (
            <MemoizedCard
              key={`card-${item.id || index}`}
              item={item}
              position={position}
              expandedState={expandedStates[item.id]}
              toggleExpand={() => handleToggleExpand(item.id)}
              fetchedUser={fetchedUser}
              theme={theme}
              registerClicks={registerClicks}
              renderPhotoBook={renderPhotoBook}
              contentAnimation={contentAnimation}
            />
          );
        })}
      </div>
    </div>
  );
}
