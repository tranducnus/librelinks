import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const {
      // Font sizes
      profileNameFontSize,
      bioFontSize,
      linkTitleFontSize,
      // Font families
      profileNameFontFamily,
      bioFontFamily,
      linkTitleFontFamily,
      // Image sizes
      socialIconSize,
      faviconSize,
      // Background image
      backgroundImage,
      // Spacing fields
      bioToFirstCardPadding,
      // Other customization fields
      ...otherFields
    } = req.body;

    // Validate font sizes
    if (profileNameFontSize && (profileNameFontSize < 12 || profileNameFontSize > 32)) {
      res.status(400).json({
        message: 'Profile name font size must be between 12px and 32px',
      });
      return;
    }
    if (bioFontSize && (bioFontSize < 12 || bioFontSize > 32)) {
      res.status(400).json({ message: 'Bio font size must be between 12px and 32px' });
      return;
    }
    if (linkTitleFontSize && (linkTitleFontSize < 12 || linkTitleFontSize > 32)) {
      res.status(400).json({
        message: 'Link title font size must be between 12px and 32px',
      });
      return;
    }

    // Validate image sizes
    if (socialIconSize && (socialIconSize < 16 || socialIconSize > 64)) {
      res.status(400).json({ message: 'Social icon size must be between 16px and 64px' });
      return;
    }
    if (faviconSize && (faviconSize < 16 || faviconSize > 64)) {
      res.status(400).json({ message: 'Favicon size must be between 16px and 64px' });
      return;
    }

    // Validate background image if provided
    if (backgroundImage !== undefined && backgroundImage !== null && backgroundImage !== '') {
      // If it's not null or empty, verify it exists in the database
      if (backgroundImage !== 'none') {
        const bgImage = await db.backgroundImage.findFirst({
          where: {
            imageUrl: backgroundImage,
            OR: [{ isPublic: true }, { userId: session.user.id }],
          },
        });

        if (!bgImage) {
          res.status(400).json({ message: 'Invalid background image selection' });
          return;
        }
      }
    }

    const user = await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        // Font sizes
        profileNameFontSize,
        bioFontSize,
        linkTitleFontSize,
        // Font families
        profileNameFontFamily,
        bioFontFamily,
        linkTitleFontFamily,
        // Image sizes
        socialIconSize,
        faviconSize,
        // Background image - set to null if 'none' is selected
        backgroundImage: backgroundImage === 'none' ? null : backgroundImage,
        // Spacing fields
        bioToFirstCardPadding,
        // Other customization fields
        ...otherFields,
      },
    });

    res.status(200).json(user);
    return;
  } catch (error) {
    console.error('Error in customize API:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
