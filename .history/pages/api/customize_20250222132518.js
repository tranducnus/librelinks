import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const {
      buttonStyle,
      themePalette,
      profileNameFontSize,
      bioFontSize,
      linkTitleFontSize,
    } = req.body;

    const updatedCustomizations = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        buttonStyle: buttonStyle,
        themePalette: themePalette,
        ...(profileNameFontSize !== undefined && { profileNameFontSize }),
        ...(bioFontSize !== undefined && { bioFontSize }),
        ...(linkTitleFontSize !== undefined && { linkTitleFontSize }),
      },
    });

    return res.status(200).json(updatedCustomizations);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
