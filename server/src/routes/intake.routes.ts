import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/intake:
 *   post:
 *     summary: Record water intake
 *     tags: [Intake]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount in ml
 *                 example: 250
 *               source:
 *                 type: string
 *                 enum: [manual, notification, reminder]
 *                 description: Source of the intake record
 *               note:
 *                 type: string
 *                 description: Optional note
 *     responses:
 *       201:
 *         description: Intake recorded successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const { amount, source, note } = req.body;
    const userId = req.user!.id;

    // Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ error: 'Valid amount is required (positive number)' });
      return;
    }

    if (amount > 5000) {
      res.status(400).json({ error: 'Amount cannot exceed 5000ml' });
      return;
    }

    // Create intake record
    const intake = await prisma.intake.create({
      data: {
        amount,
        userId,
        source: source || 'manual',
        note
      }
    });

    res.status(201).json({
      message: 'Intake recorded successfully',
      intake
    });
  } catch (error) {
    console.error('Create intake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/intake/daily:
 *   get:
 *     summary: Get daily intake statistics
 *     tags: [Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format (defaults to today)
 *     responses:
 *       200:
 *         description: Daily statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/daily', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const dateParam = req.query.date as string | undefined;

    // Parse date or use today
    let targetDate: Date;
    if (dateParam) {
      targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        return;
      }
    } else {
      targetDate = new Date();
    }

    // Set start and end of the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get user's goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { goal: true }
    });

    const dailyGoal = user?.goal || 2000;

    // Get all intakes for the day
    const intakes = await prisma.intake.findMany({
      where: {
        userId,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Calculate total
    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
    const remaining = Math.max(0, dailyGoal - totalAmount);
    const percentage = Math.min(100, Math.round((totalAmount / dailyGoal) * 100));

    res.json({
      date: startOfDay.toISOString().split('T')[0],
      goal: dailyGoal,
      totalAmount,
      remaining,
      percentage,
      intakeCount: intakes.length,
      intakes: intakes.map(intake => ({
        id: intake.id,
        amount: intake.amount,
        timestamp: intake.timestamp,
        source: intake.source,
        note: intake.note
      }))
    });
  } catch (error) {
    console.error('Get daily intake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/intake/history:
 *   get:
 *     summary: Get intake history
 *     tags: [Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to fetch
 *     responses:
 *       200:
 *         description: History retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;

    // Limit to 30 days max
    const daysLimit = Math.min(days, 30);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLimit);
    startDate.setHours(0, 0, 0, 0);

    const intakes = await prisma.intake.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Group by date
    const groupedByDate: Record<string, { total: number; count: number }> = {};

    intakes.forEach(intake => {
      const dateKey = intake.timestamp.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { total: 0, count: 0 };
      }
      groupedByDate[dateKey].total += intake.amount;
      groupedByDate[dateKey].count += 1;
    });

    // Convert to array
    const history = Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date,
        totalAmount: data.total,
        intakeCount: data.count
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      days: daysLimit,
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/intake/{id}:
 *   delete:
 *     summary: Delete an intake record
 *     tags: [Intake]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Intake deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Intake not found
 */
router.delete('/:id', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Check if intake belongs to user
    const intake = await prisma.intake.findUnique({
      where: { id: id as string }
    });

    if (!intake) {
      res.status(404).json({ error: 'Intake not found' });
      return;
    }

    if (intake.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.intake.delete({
      where: { id: id as string }
    });

    res.json({ message: 'Intake deleted successfully' });
  } catch (error) {
    console.error('Delete intake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
