import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CheckMark } from '@/components/utils/checkmark';
import useCurrentUser from '@/hooks/useCurrentUser';
import { signalIframe } from '@/utils/helpers';
import ErrorBoundary from '@/components/core/error-boundary';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Loading state component
const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <LoadingSpinner size="lg" className="mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
);

// Separate component for the image grid to wrap in error boundary
const BackgroundImageGrid = ({
  backgroundImages,
  selectedImage,
  isUpdating,
  onImageSelect,
  onRemoveBackground,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
      {/* None option */}
      <div
        className={`rounded-lg overflow-hidden cursor-pointer relative border-2 h-32 flex items-center justify-center ${
          !selectedImage ? 'border-blue-500' : 'border-gray-200'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={!isUpdating ? onRemoveBackground : undefined}
      >
        <div className="text-center">
          <p className="font-medium">None</p>
          <p className="text-xs text-gray-500">Remove background</p>
        </div>
        {!selectedImage && (
          <span className="absolute top-2 right-2 z-10">
            <CheckMark />
          </span>
        )}
        {isUpdating && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Background image options */}
      {backgroundImages.map((image) => (
        <div
          key={image.id}
          className={`rounded-lg overflow-hidden cursor-pointer relative border-2 h-32 ${
            selectedImage === image.imageUrl
              ? 'border-blue-500'
              : 'border-gray-200 hover:border-gray-300'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={
            !isUpdating ? () => onImageSelect(image.imageUrl) : undefined
          }
        >
          <div className="w-full h-full">
            <img
              src={image.imageUrl}
              alt={image.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
            <p className="text-xs truncate">{image.name}</p>
          </div>
          {selectedImage === image.imageUrl && (
            <span className="absolute top-2 right-2 z-10 text-white">
              <CheckMark />
            </span>
          )}
          {isUpdating && selectedImage === image.imageUrl && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const BackgroundImageSelector = () => {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch background images with error handling
  const {
    data: backgroundImages,
    isLoading: isImagesLoading,
    error: imagesError,
  } = useQuery({
    queryKey: ['backgroundImages'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/background-images');
        return data;
      } catch (error) {
        console.error('Error fetching background images:', error);
        throw new Error(
          'Failed to load background images. Please try again later.'
        );
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Initialize and sync selected image with user data
  useEffect(() => {
    if (!isUserLoading && currentUser) {
      try {
        if (currentUser.backgroundImage) {
          setSelectedImage(currentUser.backgroundImage);
        } else {
          setSelectedImage(null);
        }
      } catch (error) {
        console.error('Error syncing background image state:', error);
        toast.error('Failed to sync background image selection');
      }
    }
  }, [currentUser, isUserLoading]);

  const mutateBackground = useMutation(
    async (imageUrl) => {
      setIsUpdating(true);
      try {
        await axios.patch('/api/customize', {
          backgroundImage: imageUrl,
        });
      } catch (error) {
        console.error('Error updating background:', error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['currentUser']);
        signalIframe();
      },
      onError: (error) => {
        console.error('Error updating background:', error);
        toast.error('Failed to update background image. Please try again.');
        setSelectedImage(currentUser?.backgroundImage || null);
      },
    }
  );

  const handleImageSelect = async (imageUrl) => {
    if (isUpdating) return;

    await toast.promise(mutateBackground.mutateAsync(imageUrl), {
      loading: 'Updating background image...',
      success: 'Background image updated successfully',
      error: 'Failed to update background image',
    });
    setSelectedImage(imageUrl);
  };

  const handleRemoveBackground = async () => {
    if (isUpdating) return;

    await toast.promise(mutateBackground.mutateAsync('none'), {
      loading: 'Removing background image...',
      success: 'Background image removed successfully',
      error: 'Failed to remove background image',
    });
    setSelectedImage(null);
  };

  // Error states
  if (userError) {
    return (
      <div className="max-w-[640px] mx-auto my-6">
        <h3 className="text-xl font-semibold">Background Images</h3>
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">
            Failed to load user data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (imagesError) {
    return (
      <div className="max-w-[640px] mx-auto my-6">
        <h3 className="text-xl font-semibold">Background Images</h3>
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{imagesError.message}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isUserLoading || isImagesLoading) {
    return (
      <div className="max-w-[640px] mx-auto my-6">
        <h3 className="text-xl font-semibold">Background Images</h3>
        <LoadingState
          message={
            isUserLoading
              ? 'Loading user data...'
              : 'Loading background images...'
          }
        />
      </div>
    );
  }

  // Error state for missing background images
  if (!backgroundImages || backgroundImages.length === 0) {
    return (
      <div className="max-w-[640px] mx-auto my-6">
        <h3 className="text-xl font-semibold">Background Images</h3>
        <div className="my-4 p-4 text-center">
          <p>No background images available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto my-6">
      <h3 className="text-xl font-semibold">Background Images</h3>
      <p className="text-gray-600 mt-2 mb-4">
        Select a background image for your profile. The background image will be
        displayed behind your theme.
      </p>

      <ErrorBoundary
        fallbackTitle="Failed to load background image selector"
        fallbackMessage="There was an error loading the background image selector. Please try refreshing the page."
      >
        <BackgroundImageGrid
          backgroundImages={backgroundImages}
          selectedImage={selectedImage}
          isUpdating={isUpdating}
          onImageSelect={handleImageSelect}
          onRemoveBackground={handleRemoveBackground}
        />
      </ErrorBoundary>
    </div>
  );
};

export default BackgroundImageSelector;
