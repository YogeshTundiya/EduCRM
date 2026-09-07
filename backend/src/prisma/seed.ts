import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function addMonths(startDate: Date, months: number): Date {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function main() {
  console.log('🌱 Seeding Technoglobe PRO database...');

  // 1. Clean existing records
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.module.deleteMany();
  await prisma.courseProfessor.deleteMany();
  await prisma.course.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Create Admin
  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.create({
    data: {
      name: 'Sajibur Rahman',
      email: 'admin@technoglobe.com',
      passwordHash,
      role: 'ADMIN'
    }
  });
  console.log(`✅ Admin created: ${admin.email} (password: admin123)`);

  // 3. Create Courses with Modules
  const fullstack = await prisma.course.create({
    data: {
      name: 'Full Stack Web Development',
      type: 'TECHNICAL',
      durationMonths: 6,
      description: 'Comprehensive program covering modern frontend, backend systems, database architecture and production deployment.',
      status: 'ACTIVE',
      modules: {
        create: [
          { name: 'HTML5 & CSS3', order: 1 },
          { name: 'JavaScript & TypeScript', order: 2 },
          { name: 'MongoDB Database Design', order: 3 },
          { name: 'Node.js & Express API', order: 4 },
          { name: 'React & Next.js Ecosystem', order: 5 },
          { name: 'Full Stack Capstone Project', order: 6 }
        ]
      }
    }
  });

  const security = await prisma.course.create({
    data: {
      name: 'Cyber Security & Ethical Hacking',
      type: 'TECHNICAL',
      durationMonths: 4,
      description: 'Practical security methodologies, penetration testing, network defenses, and threat analysis.',
      status: 'ACTIVE',
      modules: {
        create: [
          { name: 'Linux Fundamentals', order: 1 },
          { name: 'Networking & Protocols', order: 2 },
          { name: 'Ethical Hacking Tools', order: 3 },
          { name: 'Penetration Testing Lab', order: 4 },
          { name: 'Incident Response & Hardening', order: 5 }
        ]
      }
    }
  });

  const cloud = await prisma.course.create({
    data: {
      name: 'Cloud & DevOps Architecture',
      type: 'TECHNICAL',
      durationMonths: 5,
      description: 'Master containerization, CI/CD pipelines, automated infrastructure and Kubernetes clusters.',
      status: 'ACTIVE',
      modules: {
        create: [
          { name: 'Linux & Bash Scripting', order: 1 },
          { name: 'Docker Containers', order: 2 },
          { name: 'Kubernetes Orchestration', order: 3 },
          { name: 'AWS Cloud Services', order: 4 },
          { name: 'CI/CD Pipelines & Terraform', order: 5 }
        ]
      }
    }
  });

  const uiux = await prisma.course.create({
    data: {
      name: 'UI/UX Design Systems & Motion',
      type: 'NON_TECHNICAL',
      durationMonths: 4,
      description: 'End-to-end design theory, micro-interactions, Figma component architecture and design tokens.',
      status: 'ACTIVE',
      modules: {
        create: [
          { name: 'Design Principles & Wireframing', order: 1 },
          { name: 'Figma Mastery & Prototyping', order: 2 },
          { name: 'Design Systems & Tokens', order: 3 },
          { name: 'Motion & Micro-interactions', order: 4 }
        ]
      }
    }
  });

  console.log('✅ Courses & modules created');

  // 4. Create Professors & Link to Courses
  const profAris = await prisma.professor.create({
    data: {
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@technoglobe.edu',
      phone: '+91 98290 12345',
      specialization: 'Distributed Systems & Web Tech',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      courses: {
        create: [
          { course: { connect: { id: fullstack.id } } },
          { course: { connect: { id: cloud.id } } }
        ]
      }
    }
  });

  const profElena = await prisma.professor.create({
    data: {
      name: 'Prof. Elena Rostova',
      email: 'elena.rostova@technoglobe.edu',
      phone: '+91 98290 23456',
      specialization: 'Cyber Security & Cryptography',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      courses: {
        create: [
          { course: { connect: { id: security.id } } }
        ]
      }
    }
  });

  const profPriya = await prisma.professor.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@technoglobe.edu',
      phone: '+91 98290 45678',
      specialization: 'Human-Computer Interaction & UI',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      courses: {
        create: [
          { course: { connect: { id: uiux.id } } }
        ]
      }
    }
  });

  console.log('✅ Faculty created and linked to courses');

  // 5. Create Students with auto-computed endDate
  const start1 = new Date('2026-03-01');
  const end1 = addMonths(start1, fullstack.durationMonths);

  const studentAlex = await prisma.student.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+91 98290 99887',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      courseId: fullstack.id,
      professorId: profAris.id,
      startDate: start1,
      endDate: end1,
      status: 'ACTIVE'
    }
  });

  const start2 = new Date('2026-04-15');
  const end2 = addMonths(start2, security.durationMonths);

  const studentSophia = await prisma.student.create({
    data: {
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      phone: '+91 98290 88776',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      courseId: security.id,
      professorId: profElena.id,
      startDate: start2,
      endDate: end2,
      status: 'ACTIVE'
    }
  });

  const start3 = new Date('2026-09-15');
  const end3 = addMonths(start3, fullstack.durationMonths);

  await prisma.student.create({
    data: {
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+91 98290 77665',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      courseId: fullstack.id,
      professorId: profAris.id,
      startDate: start3,
      endDate: end3,
      status: 'UPCOMING'
    }
  });

  console.log('✅ Students seeded with auto-computed end dates');

  // 6. Create Attendance Record
  const attDate = new Date('2026-09-02');
  attDate.setHours(0, 0, 0, 0);

  await prisma.attendance.create({
    data: {
      studentId: studentAlex.id,
      courseId: fullstack.id,
      date: attDate,
      status: 'PRESENT',
      checkInAt: new Date('2026-09-02T09:02:00.000Z'),
      checkOutAt: new Date('2026-09-02T17:00:00.000Z'),
      markedBy: 'Admin'
    }
  });

  await prisma.attendance.create({
    data: {
      studentId: studentSophia.id,
      courseId: security.id,
      date: attDate,
      status: 'PRESENT',
      checkInAt: new Date('2026-09-02T09:14:00.000Z'),
      checkOutAt: new Date('2026-09-02T17:00:00.000Z'),
      markedBy: 'Admin'
    }
  });

  console.log('✅ Initial attendance sessions seeded');
  console.log('🎉 Technoglobe database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
