import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { store_hash } = await params;

  const filePath = path.join(process.cwd(), 'public', 'ymm-scripts', 'store-wise-main-scripts', `${store_hash}`);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(fileContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
  
}
