import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // Хешируем пароль для всех тестовых пользователей
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Создаем тестовых пользователей
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@constructure.app' },
      update: {},
      create: {
        email: 'admin@constructure.app',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Админ',
        lastName: 'Конструктор',
        avatar: 'https://ui-avatars.com/api/?name=Админ+Конструктор&background=6366f1&color=fff',
        verified: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'teacher@constructure.app' },
      update: {},
      create: {
        email: 'teacher@constructure.app',
        username: 'teacher',
        password: hashedPassword,
        firstName: 'Мария',
        lastName: 'Преподавательница',
        avatar: 'https://ui-avatars.com/api/?name=Мария+Преподавательница&background=10b981&color=fff',
        verified: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'student@constructure.app' },
      update: {},
      create: {
        email: 'student@constructure.app',
        username: 'student',
        password: hashedPassword,
        firstName: 'Иван',
        lastName: 'Студентов',
        avatar: 'https://ui-avatars.com/api/?name=Иван+Студентов&background=f59e0b&color=fff',
        verified: true
      }
    })
  ]);

  console.log(`✅ Создано ${users.length} пользователей`);

  // Создаем тестовые курсы
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'demo-course-1' },
      update: {},
      create: {
        id: 'demo-course-1',
        title: 'Основы веб-разработки',
        description: 'Изучите основы HTML, CSS и JavaScript с нуля. Курс для начинающих разработчиков.',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        isPublic: true,
        isTemplate: false,
        authorId: users[0].id
      }
    }),
    prisma.course.upsert({
      where: { id: 'demo-course-2' },
      update: {},
      create: {
        id: 'demo-course-2',
        title: 'React для продвинутых',
        description: 'Углубленное изучение React: хуки, контекст, оптимизация производительности.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
        isPublic: true,
        isTemplate: false,
        authorId: users[1].id
      }
    }),
    prisma.course.upsert({
      where: { id: 'demo-course-3' },
      update: {},
      create: {
        id: 'demo-course-3',
        title: 'Математика для программистов',
        description: 'Дискретная математика, алгоритмы и структуры данных.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
        isPublic: false,
        isTemplate: true,
        authorId: users[1].id
      }
    })
  ]);

  console.log(`✅ Создано ${courses.length} курсов`);

  // Создаем узлы для первого курса (демонстрация структуры)
  const nodes = await Promise.all([
    prisma.courseNode.create({
      data: {
        courseId: courses[0].id,
        type: 'START',
        title: 'Добро пожаловать!',
        content: {
          text: 'Добро пожаловать в курс "Основы веб-разработки"! Здесь вы изучите основы HTML, CSS и JavaScript.',
          duration: 5
        },
        positions: {
          tree: { x: 100, y: 100 },
          lego: { x: 50, y: 50 },
          mindmap: { x: 200, y: 200 },
          flowchart: { x: 150, y: 100 }
        },
        config: {
          backgroundColor: '#e0f2fe',
          textColor: '#0f172a'
        }
      }
    }),
    prisma.courseNode.create({
      data: {
        courseId: courses[0].id,
        type: 'LESSON',
        title: 'Урок 1: Что такое HTML?',
        content: {
          text: 'HTML (HyperText Markup Language) - это язык разметки, используемый для создания веб-страниц.',
          videoUrl: 'https://example.com/video1',
          duration: 15
        },
        positions: {
          tree: { x: 300, y: 100 },
          lego: { x: 200, y: 50 },
          mindmap: { x: 400, y: 200 },
          flowchart: { x: 350, y: 100 }
        },
        config: {
          backgroundColor: '#fef3c7',
          textColor: '#0f172a'
        }
      }
    }),
    prisma.courseNode.create({
      data: {
        courseId: courses[0].id,
        type: 'TEST',
        title: 'Тест: Проверка знаний HTML',
        content: {
          questions: [
            {
              question: 'Что означает HTML?',
              options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
              correct: 0
            },
            {
              question: 'Какой тег используется для заголовка?',
              options: ['<head>', '<h1>', '<title>'],
              correct: 1
            }
          ],
          passingScore: 80
        },
        positions: {
          tree: { x: 500, y: 100 },
          lego: { x: 350, y: 50 },
          mindmap: { x: 600, y: 200 },
          flowchart: { x: 550, y: 100 }
        },
        config: {
          backgroundColor: '#fce7f3',
          textColor: '#0f172a'
        }
      }
    }),
    prisma.courseNode.create({
      data: {
        courseId: courses[0].id,
        type: 'END',
        title: 'Поздравляем!',
        content: {
          text: 'Вы успешно завершили введение в HTML. Переходите к следующему модулю!',
          certificate: true
        },
        positions: {
          tree: { x: 700, y: 100 },
          lego: { x: 500, y: 50 },
          mindmap: { x: 800, y: 200 },
          flowchart: { x: 750, y: 100 }
        },
        config: {
          backgroundColor: '#dcfce7',
          textColor: '#0f172a'
        }
      }
    })
  ]);

  console.log(`✅ Создано ${nodes.length} узлов курса`);

  // Создаем связи между узлами
  const edges = await Promise.all([
    prisma.courseEdge.create({
      data: {
        courseId: courses[0].id,
        sourceId: nodes[0].id,
        targetId: nodes[1].id,
        type: 'SEQUENCE',
        label: 'Начать обучение',
        style: {
          color: '#3b82f6',
          width: 2
        }
      }
    }),
    prisma.courseEdge.create({
      data: {
        courseId: courses[0].id,
        sourceId: nodes[1].id,
        targetId: nodes[2].id,
        type: 'SEQUENCE',
        label: 'Проверить знания',
        style: {
          color: '#10b981',
          width: 2
        }
      }
    }),
    prisma.courseEdge.create({
      data: {
        courseId: courses[0].id,
        sourceId: nodes[2].id,
        targetId: nodes[3].id,
        type: 'CONDITION',
        label: 'При успешном прохождении',
        condition: {
          type: 'test_passed',
          minScore: 80
        },
        style: {
          color: '#f59e0b',
          width: 2,
          style: 'dashed'
        }
      }
    })
  ]);

  console.log(`✅ Создано ${edges.length} связей между узлами`);

  // Добавляем соавторов
  await prisma.courseCollaborator.create({
    data: {
      courseId: courses[0].id,
      userId: users[2].id,
      role: 'VIEWER'
    }
  });

  console.log('✅ Добавлены соавторы курсов');

  console.log('\n🎉 База данных успешно заполнена!');
  console.log('\n📋 Тестовые пользователи:');
  console.log('1. admin@constructure.app - пароль: password123 (Админ)');
  console.log('2. teacher@constructure.app - пароль: password123 (Преподаватель)');
  console.log('3. student@constructure.app - пароль: password123 (Студент)');
  console.log('\n📚 Созданы демонстрационные курсы с узлами и связями');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 