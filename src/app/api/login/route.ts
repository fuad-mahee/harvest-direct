import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Check if user is admin or approved
  if (user.role !== 'ADMIN' && user.status !== 'APPROVED') {
    let message = 'Account access denied';
    if (user.status === 'PENDING') {
      message = 'Your account is pending approval';
    } else if (user.status === 'REJECTED') {
      message = 'Your account has been rejected';
    }
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Return success with user role for proper redirection
  return NextResponse.json({ 
    success: true, 
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    }
  });
}
