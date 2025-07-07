import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { writeFile } from 'fs/promises';
import { join } from 'path';
const { v4: uuidv4 } = require('uuid');
import { auth } from '@/app/api/auth/[...nextauth]/route';

// Validation schema for course creation
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0),
  duration: z.number().min(0),
  instructorId: z.string().min(1, 'Instructor ID is required')
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Validate form data
    const courseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      level: formData.get('level'),
      price: parseFloat(formData.get('price') as string),
      duration: parseInt(formData.get('duration') as string),
      instructorId: session.user.id
    };

    try {
      courseSchema.parse(courseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueFilename = `${uuidv4()}-${image.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, uniqueFilename);

    // Save the file
    await writeFile(filePath, buffer);

    // Create course with image path
    const course = await prisma.course.create({
      data: {
        ...courseData,
        imageUrl: `/uploads/${uniqueFilename}`,
        isPublished: false
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const isPublished = searchParams.get('isPublished');

    // Build query based on user role and filters
    const where = {
      ...(session.user.role === 'INSTRUCTOR' && { instructorId: session.user.id }),
      ...(instructorId && { instructorId }),
      ...(isPublished && { isPublished: isPublished === 'true' })
    };

    console.log('Fetching courses with query:', where);

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found courses:', courses.length);

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('prisma')) {
        return NextResponse.json(
          { error: 'Database error', details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 