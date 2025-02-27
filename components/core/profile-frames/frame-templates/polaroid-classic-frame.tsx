import React from 'react';
import { motion } from 'framer-motion';
import {
  getFrameCacheKey,
  useOptimizedFrame,
  getOptimizedStyles,
} from '../frame-optimizations';

interface PolaroidClassicFrameProps {
  size: number;
  color: string;
  thickness: number;
  rotation: number;
  animation?: {
    type: string | null;
    enabled: boolean;
    config: Record<string, any>;
  };
  className?: string;
}

export const PolaroidClassicFrame: React.FC<PolaroidClassicFrameProps> = ({
  size,
  color,
  thickness,
  rotation,
  animation,
  className,
}) => {
  const cacheKey = getFrameCacheKey(
    'polaroid-classic',
    size,
    color,
    rotation,
    thickness,
    '',
    animation
  );
  const isAnimated = !!(animation?.enabled && animation.type !== null);
  const optimizedStyles = getOptimizedStyles(isAnimated);
  const animationProps = getAnimationProps(animation);

  // Calculate dimensions based on thickness
  const viewBoxSize = 100;
  const borderRadius = 8;
  const frameSize = viewBoxSize - thickness;

  const renderFrame = () => (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
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
        x={thickness / 2}
        y={thickness / 2}
        width={frameSize}
        height={frameSize}
        rx={borderRadius}
        stroke={color}
        strokeWidth={thickness}
        fill="transparent"
      />
    </motion.svg>
  );

  const optimizedFrame = useOptimizedFrame(renderFrame, cacheKey);

  // Return null if thickness is undefined
  if (thickness === undefined) {
    return null;
  }

  return optimizedFrame;
};

const getAnimationProps = (
  animation: PolaroidClassicFrameProps['animation']
) => {
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

export default PolaroidClassicFrame;
