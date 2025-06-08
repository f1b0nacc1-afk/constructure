import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Схемы валидации
const createCourseSchema = z.object({
  title: z.string().min(1, 'Название курса обязательно'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  isPublic: z.boolean().default(false),
  isTemplate: z.boolean().default(false)
});

const updateCourseSchema = createCourseSchema.partial();

const courseParamsSchema = z.object({
  id: z.string().cuid()
});

const coursesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  isPublic: z.coerce.boolean().optional(),
  isTemplate: z.coerce.boolean().optional()
});

export default async function coursesRoutes(fastify: FastifyInstance) {
  // Добавляем хук для аутентификации ко всем маршрутам курсов
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Требуется аутентификация' });
    }
  });

  // GET /api/courses - Получить список курсов пользователя
  fastify.get<{ 
    Querystring: z.infer<typeof coursesQuerySchema> 
  }>('/', async (request, reply) => {
    try {
      const { page, limit, search, isPublic, isTemplate } = coursesQuerySchema.parse(request.query);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }
      
      const offset = (page - 1) * limit;

      // Фильтры для поиска
      const where: any = {
        OR: [
          { authorId: userId },
          { 
            collaborators: { 
              some: { userId: userId } 
            } 
          }
        ]
      };

      if (search) {
        where.AND = [
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } }
            ]
          }
        ];
      }

      if (typeof isPublic === 'boolean') {
        where.isPublic = isPublic;
      }

      if (typeof isTemplate === 'boolean') {
        where.isTemplate = isTemplate;
      }

      // Получаем курсы с пагинацией
      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where,
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            isPublic: true,
            isTemplate: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            _count: {
              select: {
                nodes: true,
                collaborators: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.course.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return reply.send({
        courses,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // GET /api/courses/:id - Получить конкретный курс
  fastify.get<{ 
    Params: z.infer<typeof courseParamsSchema> 
  }>('/:id', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { 
              collaborators: { 
                some: { userId: userId } 
              } 
            },
            { isPublic: true }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          nodes: {
            include: {
              sourceEdges: true,
              targetEdges: true
            }
          },
          collaborators: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!course) {
        return reply.code(404).send({ error: 'Курс не найден' });
      }

      return reply.send({ course });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // POST /api/courses - Создать новый курс
  fastify.post<{ 
    Body: z.infer<typeof createCourseSchema> 
  }>('/', async (request, reply) => {
    try {
      const courseData = createCourseSchema.parse(request.body);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      const course = await prisma.course.create({
        data: {
          ...courseData,
          authorId: userId
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return reply.code(201).send({ course });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ 
          error: 'Ошибка валидации', 
          details: error.errors 
        });
      }
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // PUT /api/courses/:id - Обновить курс
  fastify.put<{ 
    Params: z.infer<typeof courseParamsSchema>;
    Body: z.infer<typeof updateCourseSchema> 
  }>('/:id', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const courseData = updateCourseSchema.parse(request.body);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права доступа
      const existingCourse = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { 
              collaborators: { 
                some: { 
                  userId: userId,
                  role: 'EDITOR'
                } 
              } 
            }
          ]
        }
      });

      if (!existingCourse) {
        return reply.code(404).send({ error: 'Курс не найден или нет прав доступа' });
      }

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: courseData,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return reply.send({ course: updatedCourse });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ 
          error: 'Ошибка валидации', 
          details: error.errors 
        });
      }
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // DELETE /api/courses/:id - Удалить курс
  fastify.delete<{ 
    Params: z.infer<typeof courseParamsSchema> 
  }>('/:id', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права доступа (только автор может удалить)
      const existingCourse = await prisma.course.findFirst({
        where: {
          id,
          authorId: userId
        }
      });

      if (!existingCourse) {
        return reply.code(404).send({ error: 'Курс не найден или нет прав на удаление' });
      }

      await prisma.course.delete({
        where: { id }
      });

      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // POST /api/courses/:id/duplicate - Дублировать курс
  fastify.post<{ 
    Params: z.infer<typeof courseParamsSchema> 
  }>('/:id/duplicate', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      const originalCourse = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { 
              collaborators: { 
                some: { userId: userId } 
              } 
            },
            { isPublic: true }
          ]
        },
        include: {
          nodes: true,
          edges: true
        }
      });

      if (!originalCourse) {
        return reply.code(404).send({ error: 'Курс не найден' });
      }

      // Создаем транзакцию для дублирования курса
      const duplicatedCourse = await prisma.$transaction(async (tx) => {
        // Создаем новый курс
        const newCourse = await tx.course.create({
          data: {
            title: `${originalCourse.title} (копия)`,
            description: originalCourse.description,
            thumbnail: originalCourse.thumbnail,
            authorId: userId,
            isPublic: false,
            isTemplate: originalCourse.isTemplate
          }
        });

        // Мапинг старых ID узлов на новые
        const nodeIdMap = new Map<string, string>();

        // Копируем узлы
        for (const node of originalCourse.nodes) {
          const newNode = await tx.courseNode.create({
            data: {
              courseId: newCourse.id,
              type: node.type,
              title: node.title,
              content: node.content === null ? undefined : node.content,
              positions: node.positions,
              config: node.config === null ? undefined : node.config
            }
          });
          nodeIdMap.set(node.id, newNode.id);
        }

        // Копируем связи
        for (const edge of originalCourse.edges) {
          const newSourceId = nodeIdMap.get(edge.sourceId);
          const newTargetId = nodeIdMap.get(edge.targetId);
          
          if (newSourceId && newTargetId) {
            await tx.courseEdge.create({
              data: {
                courseId: newCourse.id,
                sourceId: newSourceId,
                targetId: newTargetId,
                type: edge.type,
                label: edge.label || undefined,
                condition: edge.condition === null ? undefined : edge.condition,
                style: edge.style === null ? undefined : edge.style
              }
            });
          }
        }

        return tx.course.findUnique({
          where: { id: newCourse.id },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      });

      return reply.code(201).send({ course: duplicatedCourse });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });
} 