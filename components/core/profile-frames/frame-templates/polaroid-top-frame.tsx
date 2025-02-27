import React from 'react';
import { motion } from 'framer-motion';
import {
  getFrameCacheKey,
  useOptimizedFrame,
  getOptimizedStyles,
} from '../frame-optimizations';

interface PolaroidTopFrameProps {
  size: number;
  color: string;
  rotation: number;
  name: string;
  animation?: {
    type: string | null;
    enabled: boolean;
    config: Record<string, any>;
  };
  className?: string;
}

export const PolaroidTopFrame: React.FC<PolaroidTopFrameProps> = ({
  size,
  color,
  rotation,
  name,
  animation,
  className,
}) => {
  const cacheKey = getFrameCacheKey(
    'polaroid-classic',
    size,
    color,
    rotation,
    0,
    name,
    animation
  );
  const isAnimated = !!(animation?.enabled && animation.type !== null);
  const optimizedStyles = getOptimizedStyles(isAnimated);
  const animationProps = getAnimationProps(animation);

  const frameWidth = 85;
  const frameHeight = 100;
  const borderRadius = 8;

  const renderFrame = () => (
    <motion.svg
      width={size}
      height={size * (frameHeight / frameWidth)}
      viewBox={`0 0 ${frameWidth} ${frameHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        rotate: `${rotation}deg`,
        ...optimizedStyles,
      }}
      className={className}
      {...animationProps}
    >
      <rect
        x="2"
        y="2"
        width={frameWidth - 4}
        height={frameHeight - 4}
        rx={borderRadius}
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      <text
        x="50%"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="8"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        {name}
      </text>
    </motion.svg>
  );

  return useOptimizedFrame(renderFrame, cacheKey);
};

const getAnimationProps = (animation: PolaroidTopFrameProps['animation']) => {
  if (!animation?.enabled || !animation.type) return {};

  switch (animation.type) {
    case 'rotate':
      return {
        animate: { rotate: [0, 360] },
        transition: {
          duration: animation.config.duration || 3,
          repeat: Infinity,
          ease: 'linear',
        },
      };
    case 'pulse':
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: {
          duration: animation.config.duration || 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };
    case 'glow':
      return {
        animate: {
          filter: [
            'drop-shadow(0 0 0px)',
            'drop-shadow(0 0 8px)',
            'drop-shadow(0 0 0px)',
          ],
        },
        transition: {
          duration: animation.config.duration || 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };
    default:
      return {};
  }
};

export default PolaroidTopFrame;
