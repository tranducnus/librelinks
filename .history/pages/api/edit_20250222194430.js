import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    const { username, bio, image, handle, profileImageSize } = req.body;

    if (req.method === 'PATCH') {
      try {
        // Check if the handle already exists in the user table
        const existingUser = await db.user.findUnique({
          where: {
            handle: handle,
          },
        });

        // If the handle exists and belongs to a different user, return an error
        if (existingUser && existingUser.id !== currentUser.id) {
          return res.status(409).json({ error: 'Handle is already taken.' });
        }

        // Validate profileImageSize if provided
        if (profileImageSize !== undefined) {
          const size = parseInt(profileImageSize, 10);
          if (isNaN(size) || size < 50 || size > 500) {
            return res
              .status(400)
              .json({ error: 'Invalid profile image size' });
          }
        }

        const updatedUser = await db.user.update({
          where: {
            id: currentUser.id,
          },
          data: {
            name: username,
            bio: bio,
            image: image,
            handle: handle,
            ...(profileImageSize !== undefined && {
              profileImageSize: parseInt(profileImageSize, 10),
            }),
          },
        });

        return res.status(200).json(updatedUser);
      } catch (error) {
        console.error('Update error:', error);
        return res
          .status(500)
          .json({ error: `Could not update user at this time. ${error}` });
      }
    } else if (req.method === 'DELETE') {
      await db.user.delete({
        where: {
          id: currentUser.id,
        },
      });
      return res.status(204).end();
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(400).end();
  }
}
