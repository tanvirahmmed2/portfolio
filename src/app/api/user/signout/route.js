import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete('token');
    return response;
  } catch (error) {
    console.error('POST /api/user/signout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
