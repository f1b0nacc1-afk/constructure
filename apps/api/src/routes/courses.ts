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
  id: z.string().min(1)
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
      const userId = request.user.userId;
      
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
      const userId = request.user.userId;
      
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
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      const course = await prisma.course.create({
        data: {
          authorId: userId,
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail,
          isPublic: courseData.isPublic,
          isTemplate: courseData.isTemplate
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
    Params: z.infer<typeof courseParamsSchema>,
    Body: z.infer<typeof updateCourseSchema> 
  }>('/:id', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const updateData = updateCourseSchema.parse(request.body);
      const userId = request.user.userId;
      
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
        data: updateData,
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
      const userId = request.user.userId;
      
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
      const userId = request.user.userId;
      
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

  // === УЗЛЫ КУРСА ===

  // GET /api/courses/:id/nodes - Получить все узлы курса
  fastify.get<{ 
    Params: z.infer<typeof courseParamsSchema> 
  }>('/:id/nodes', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем доступ к курсу
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId } } },
            { isPublic: true }
          ]
        }
      });

      if (!course) {
        return reply.code(404).send({ error: 'Курс не найден' });
      }

      const nodes = await prisma.courseNode.findMany({
        where: { courseId: id },
        orderBy: { createdAt: 'asc' }
      });

      return reply.send({ nodes });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // POST /api/courses/:id/nodes - Создать узел курса
  const createNodeSchema = z.object({
    type: z.enum(['LESSON', 'TEST', 'ASSIGNMENT', 'VIDEO', 'DOCUMENT', 'INTERACTIVE', 'CONDITION', 'START', 'END']),
    title: z.string().min(1, 'Название обязательно'),
    content: z.any().optional(),
    positions: z.object({
      tree: z.object({ x: z.number(), y: z.number() }),
      lego: z.object({ x: z.number(), y: z.number() }),
      mindmap: z.object({ x: z.number(), y: z.number() }),
      flowchart: z.object({ x: z.number(), y: z.number() })
    }),
    config: z.any().optional()
  });

  fastify.post<{ 
    Params: z.infer<typeof courseParamsSchema>,
    Body: z.infer<typeof createNodeSchema>
  }>('/:id/nodes', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const nodeData = createNodeSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      const node = await prisma.courseNode.create({
        data: {
          courseId: id,
          type: nodeData.type,
          title: nodeData.title,
          content: nodeData.content,
          positions: nodeData.positions,
          config: nodeData.config
        }
      });

      return reply.code(201).send({ node });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // PUT /api/courses/:id/nodes/:nodeId - Обновить узел курса
  const updateNodeSchema = createNodeSchema.partial();

  fastify.put<{ 
    Params: z.infer<typeof courseParamsSchema> & { nodeId: string },
    Body: z.infer<typeof updateNodeSchema>
  }>('/:id/nodes/:nodeId', async (request, reply) => {
    try {
      const { id, nodeId } = request.params;
      const nodeData = updateNodeSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Проверяем существование узла
      const existingNode = await prisma.courseNode.findFirst({
        where: { id: nodeId, courseId: id }
      });

      if (!existingNode) {
        return reply.code(404).send({ error: 'Узел не найден' });
      }

      const updatedNode = await prisma.courseNode.update({
        where: { id: nodeId },
        data: nodeData
      });

      return reply.send({ node: updatedNode });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // DELETE /api/courses/:id/nodes/:nodeId - Удалить узел курса
  fastify.delete<{ 
    Params: z.infer<typeof courseParamsSchema> & { nodeId: string }
  }>('/:id/nodes/:nodeId', async (request, reply) => {
    try {
      const { id, nodeId } = request.params;
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Проверяем существование узла
      const existingNode = await prisma.courseNode.findFirst({
        where: { id: nodeId, courseId: id }
      });

      if (!existingNode) {
        return reply.code(404).send({ error: 'Узел не найден' });
      }

      await prisma.courseNode.delete({
        where: { id: nodeId }
      });

      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // === СВЯЗИ КУРСА ===

  // GET /api/courses/:id/edges - Получить все связи курса
  fastify.get<{ 
    Params: z.infer<typeof courseParamsSchema> 
  }>('/:id/edges', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем доступ к курсу
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId } } },
            { isPublic: true }
          ]
        }
      });

      if (!course) {
        return reply.code(404).send({ error: 'Курс не найден' });
      }

      const edges = await prisma.courseEdge.findMany({
        where: { courseId: id },
        orderBy: { createdAt: 'asc' }
      });

      return reply.send({ edges });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // POST /api/courses/:id/edges - Создать связь курса
  const createEdgeSchema = z.object({
    sourceId: z.string().min(1, 'ID источника обязательно'),
    targetId: z.string().min(1, 'ID цели обязательно'),
    type: z.enum(['SEQUENCE', 'CONDITION', 'REFERENCE']).default('SEQUENCE'),
    label: z.string().optional(),
    condition: z.any().optional(),
    style: z.any().optional()
  });

  fastify.post<{ 
    Params: z.infer<typeof courseParamsSchema>,
    Body: z.infer<typeof createEdgeSchema>
  }>('/:id/edges', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const edgeData = createEdgeSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Проверяем существование узлов
      const sourceNode = await prisma.courseNode.findFirst({
        where: { id: edgeData.sourceId, courseId: id }
      });
      const targetNode = await prisma.courseNode.findFirst({
        where: { id: edgeData.targetId, courseId: id }
      });

      if (!sourceNode || !targetNode) {
        return reply.code(400).send({ error: 'Один или оба узла не найдены' });
      }

      // Проверяем на существующую связь
      const existingEdge = await prisma.courseEdge.findFirst({
        where: {
          courseId: id,
          sourceId: edgeData.sourceId,
          targetId: edgeData.targetId
        }
      });

      if (existingEdge) {
        return reply.code(400).send({ error: 'Связь между этими узлами уже существует' });
      }

      const edge = await prisma.courseEdge.create({
        data: {
          courseId: id,
          sourceId: edgeData.sourceId,
          targetId: edgeData.targetId,
          type: edgeData.type,
          label: edgeData.label,
          condition: edgeData.condition,
          style: edgeData.style
        }
      });

      return reply.code(201).send({ edge });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // PUT /api/courses/:id/edges/:edgeId - Обновить связь курса
  const updateEdgeSchema = createEdgeSchema.partial();

  fastify.put<{ 
    Params: z.infer<typeof courseParamsSchema> & { edgeId: string },
    Body: z.infer<typeof updateEdgeSchema>
  }>('/:id/edges/:edgeId', async (request, reply) => {
    try {
      const { id, edgeId } = request.params;
      const edgeData = updateEdgeSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Проверяем существование связи
      const existingEdge = await prisma.courseEdge.findFirst({
        where: { id: edgeId, courseId: id }
      });

      if (!existingEdge) {
        return reply.code(404).send({ error: 'Связь не найдена' });
      }

      const updatedEdge = await prisma.courseEdge.update({
        where: { id: edgeId },
        data: edgeData
      });

      return reply.send({ edge: updatedEdge });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // DELETE /api/courses/:id/edges/:edgeId - Удалить связь курса
  fastify.delete<{ 
    Params: z.infer<typeof courseParamsSchema> & { edgeId: string }
  }>('/:id/edges/:edgeId', async (request, reply) => {
    try {
      const { id, edgeId } = request.params;
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Проверяем существование связи
      const existingEdge = await prisma.courseEdge.findFirst({
        where: { id: edgeId, courseId: id }
      });

      if (!existingEdge) {
        return reply.code(404).send({ error: 'Связь не найдена' });
      }

      await prisma.courseEdge.delete({
        where: { id: edgeId }
      });

      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // === МАКЕТЫ КУРСА ===

  // PUT /api/courses/:id/layout - Сохранить позиции узлов для определенного макета
  const saveLayoutSchema = z.object({
    mode: z.enum(['tree', 'lego', 'mindmap', 'flowchart']),
    positions: z.record(z.string(), z.object({
      x: z.number(),
      y: z.number()
    }))
  });

  fastify.put<{ 
    Params: z.infer<typeof courseParamsSchema>,
    Body: z.infer<typeof saveLayoutSchema>
  }>('/:id/layout', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const { mode, positions } = saveLayoutSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Обновляем позиции узлов
      const updates = Object.entries(positions).map(([nodeId, position]) => {
        return prisma.courseNode.updateMany({
          where: { 
            id: nodeId, 
            courseId: id 
          },
          data: {
            positions: {
              path: [mode],
              set: position
            }
          }
        });
      });

      await Promise.all(updates);

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });

  // PUT /api/courses/:id/nodes/positions - Массовое обновление позиций узлов
  const massUpdatePositionsSchema = z.object({
    positions: z.array(z.object({
      nodeId: z.string(),
      positions: z.object({
        tree: z.object({ x: z.number(), y: z.number() }).optional(),
        lego: z.object({ x: z.number(), y: z.number() }).optional(),
        mindmap: z.object({ x: z.number(), y: z.number() }).optional(),
        flowchart: z.object({ x: z.number(), y: z.number() }).optional()
      })
    }))
  });

  fastify.put<{ 
    Params: z.infer<typeof courseParamsSchema>,
    Body: z.infer<typeof massUpdatePositionsSchema>
  }>('/:id/nodes/positions', async (request, reply) => {
    try {
      const { id } = courseParamsSchema.parse(request.params);
      const { positions } = massUpdatePositionsSchema.parse(request.body);
      const userId = request.user.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Пользователь не аутентифицирован' });
      }

      // Проверяем права на редактирование курса
      const course = await prisma.course.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId: userId, role: { in: ['OWNER', 'EDITOR'] } } } }
          ]
        }
      });

      if (!course) {
        return reply.code(403).send({ error: 'Нет прав на редактирование курса' });
      }

      // Массовое обновление позиций в транзакции для производительности
      await prisma.$transaction(async (tx) => {
        for (const positionUpdate of positions) {
          // Получаем текущие позиции узла
          const currentNode = await tx.courseNode.findFirst({
            where: { 
              id: positionUpdate.nodeId, 
              courseId: id 
            },
            select: { positions: true }
          });

          if (currentNode) {
            // Объединяем текущие позиции с новыми
            const mergedPositions = {
              ...(currentNode.positions as any),
              ...positionUpdate.positions
            };

            // Обновляем узел
            await tx.courseNode.update({
              where: { id: positionUpdate.nodeId },
              data: { positions: mergedPositions }
            });
          }
        }
      });

      return reply.send({ 
        success: true, 
        message: `Обновлено позиций для ${positions.length} узлов` 
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
    }
  });
} 