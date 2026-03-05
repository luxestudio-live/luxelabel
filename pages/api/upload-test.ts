
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import formidable from 'formidable';
import type { IncomingMessage } from 'node:http';

type FormidableFields = Record<string, any>;
type FormidableFiles = Record<string, any>;

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: IncomingMessage): Promise<{ fields: FormidableFields; files: FormidableFiles }> {

  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err: any, fields: FormidableFields, files: FormidableFiles) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { fields, files } = await parseForm(req as IncomingMessage);
    console.log('Form fields:', fields);
    console.log('Form files:', files);
    let file = files.file;
    if (Array.isArray(file)) file = file[0];
    if (!file || !file.filepath) {
      console.error('No file uploaded. File object:', file);
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'products',
        resource_type: 'auto',
      });
      console.log('Cloudinary upload result:', result);
      if (!result.secure_url) {
        throw new Error('No secure_url returned from Cloudinary');
      }
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  } catch (err) {
    console.error('Form parse error:', err);
    res.status(500).json({ error: 'Form parse error' });
  }
}
