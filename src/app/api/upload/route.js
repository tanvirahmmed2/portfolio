import { NextResponse } from 'next/server';
import { uploadImageBuffer } from '@/lib/db/cloudinary.js';
import { isAdmin } from '@/lib/db/middleware.js';

export async function POST(req) {
  try {
    
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImageBuffer(buffer);
    
    return NextResponse.json({ 
      success: true, 
      url: result.url, 
      image_id: result.image_id 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
