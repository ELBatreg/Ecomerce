import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
   ,
  age: z.number().min(8, 'العمر يجب أن يكون 8 سنوات على الأقل').max(100, 'العمر يجب أن يكون 100 سنة على الأكثر'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT')
});

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { success: false, error: 'لا يوجد بيانات' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Received registration data:', body);

    // Parse and validate the request body
    const result = registerSchema.safeParse({
      ...body,
      age: typeof body.age === 'string' ? parseInt(body.age) : body.age
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error.errors[0].message 
        },
        { status: 400 }
      );
    }

    const { name, email, password, age, role } = result.data;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        age,
        role: role || 'STUDENT',
      },
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    return NextResponse.json(
      { success: true, message: 'تم إنشاء الحساب بنجاح' },
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء التسجيل' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 