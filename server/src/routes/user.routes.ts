import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        goal: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               height:
 *                 type: number
 *                 description: Height in cm
 *               weight:
 *                 type: number
 *                 description: Weight in kg
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, height, weight } = req.body;

    // Build update object with only provided fields
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (height !== undefined) {
      if (height < 0 || height > 300) {
        res.status(400).json({ error: 'Invalid height (must be 0-300 cm)' });
        return;
      }
      updateData.height = height;
    }
    if (weight !== undefined) {
      if (weight < 0 || weight > 500) {
        res.status(400).json({ error: 'Invalid weight (must be 0-500 kg)' });
        return;
      }
      updateData.weight = weight;
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        goal: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/goal:
 *   put:
 *     summary: Update daily water goal
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal
 *             properties:
 *               goal:
 *                 type: integer
 *                 minimum: 500
 *                 maximum: 10000
 *                 description: Daily water goal in ml
 *     responses:
 *       200:
 *         description: Goal updated
 *       400:
 *         description: Invalid goal value
 *       401:
 *         description: Unauthorized
 */
router.put('/goal', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { goal } = req.body;

    // Validation
    if (goal === undefined || typeof goal !== 'number') {
      res.status(400).json({ error: 'Goal is required and must be a number' });
      return;
    }

    if (goal < 500 || goal > 10000) {
      res.status(400).json({ error: 'Goal must be between 500 and 10000 ml' });
      return;
    }

    // Update user goal
    const user = await prisma.user.update({
      where: { id: userId },
      data: { goal },
      select: {
        id: true,
        email: true,
        name: true,
        goal: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Goal updated successfully',
      goal: user.goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days for statistics
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;

    const daysLimit = Math.min(days, 30);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLimit);
    startDate.setHours(0, 0, 0, 0);

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { goal: true, createdAt: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get intakes for the period
    const intakes = await prisma.intake.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate
        }
      }
    });

    // Calculate statistics
    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
    const avgDailyAmount = Math.round(totalAmount / daysLimit);
    const totalIntakes = intakes.length;

    // Count days that met the goal
    const dailyTotals: Record<string, number> = {};
    intakes.forEach(intake => {
      const dateKey = intake.timestamp.toISOString().split('T')[0];
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + intake.amount;
    });

    const daysMetGoal = Object.values(dailyTotals).filter(
      total => total >= user.goal!
    ).length;

    // Get today's progress
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const todayIntakes = intakes.filter(
      intake => intake.timestamp >= startOfToday
    );
    const todayAmount = todayIntakes.reduce((sum, intake) => sum + intake.amount, 0);

    res.json({
      period: {
        days: daysLimit,
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      goal: user.goal,
      overview: {
        totalAmount,
        avgDailyAmount,
        totalIntakes,
        daysMetGoal,
        goalCompletionRate: Math.round((daysMetGoal / daysLimit) * 100)
      },
      today: {
        amount: todayAmount,
        remaining: Math.max(0, user.goal! - todayAmount),
        percentage: Math.min(100, Math.round((todayAmount / user.goal!) * 100)),
        intakeCount: todayIntakes.length
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/stats/weekly:
 *   get:
 *     summary: Get weekly statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (ISO format). Defaults to 7 days ago
 *     responses:
 *       200:
 *         description: Weekly statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/weekly', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const startDateParam = req.query.startDate as string;

    const endDate = new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    if (!startDateParam) {
      startDate.setDate(startDate.getDate() - 7);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { goal: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const intakes = await prisma.intake.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const dailyData: Record<string, { amount: number; count: number; goalAchieved: boolean }> = {};

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dailyData[dateKey] = { amount: 0, count: 0, goalAchieved: false };
    }

    intakes.forEach(intake => {
      const dateKey = intake.timestamp.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].amount += intake.amount;
        dailyData[dateKey].count += 1;
      }
    });

    const chartData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
      goal: user.goal,
      goalAchieved: data.amount >= user.goal,
      percentage: Math.round((data.amount / user.goal) * 100)
    }));

    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
    const avgDailyAmount = Math.round(totalAmount / chartData.length);
    const daysMetGoal = chartData.filter(d => d.goalAchieved).length;
    const maxAmount = Math.max(...chartData.map(d => d.amount), 0);
    const minAmount = Math.min(...chartData.filter(d => d.amount > 0).map(d => d.amount), 0);

    res.json({
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: chartData.length
      },
      goal: user.goal,
      chartData,
      summary: {
        totalAmount,
        avgDailyAmount,
        maxAmount: maxAmount || 0,
        minAmount: minAmount || 0,
        daysMetGoal,
        goalCompletionRate: Math.round((daysMetGoal / chartData.length) * 100),
        totalIntakes: intakes.length
      }
    });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/stats/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (ISO format). Defaults to 30 days ago
 *     responses:
 *       200:
 *         description: Monthly statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/monthly', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const startDateParam = req.query.startDate as string;

    const endDate = new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    if (!startDateParam) {
      startDate.setDate(startDate.getDate() - 30);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { goal: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const intakes = await prisma.intake.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const dailyData: Record<string, { amount: number; count: number; goalAchieved: boolean }> = {};

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dailyData[dateKey] = { amount: 0, count: 0, goalAchieved: false };
    }

    intakes.forEach(intake => {
      const dateKey = intake.timestamp.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].amount += intake.amount;
        dailyData[dateKey].count += 1;
      }
    });

    const chartData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
      goal: user.goal,
      goalAchieved: data.amount >= user.goal,
      percentage: Math.round((data.amount / user.goal) * 100)
    }));

    const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
    const avgDailyAmount = Math.round(totalAmount / chartData.length);
    const daysMetGoal = chartData.filter(d => d.goalAchieved).length;
    const maxAmount = Math.max(...chartData.map(d => d.amount), 0);
    const minAmount = Math.min(...chartData.filter(d => d.amount > 0).map(d => d.amount), 0);

    res.json({
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: chartData.length
      },
      goal: user.goal,
      chartData,
      summary: {
        totalAmount,
        avgDailyAmount,
        maxAmount: maxAmount || 0,
        minAmount: minAmount || 0,
        daysMetGoal,
        goalCompletionRate: Math.round((daysMetGoal / chartData.length) * 100),
        totalIntakes: intakes.length
      }
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
