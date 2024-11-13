import { Request, Response } from 'express';
import { RegisterToken } from '../models/RegisterToken.model.ts';

/**
 * Validate a register token, return true if valid, false otherwise
 * @async
 * @param {Request} req
 * @param {Response} res
 */
export async function validateRegisterToken(
  req: Request,
  res: Response
): Promise<void> {
  const { token } = req.body;

  try {
    const registerToken = await RegisterToken.findOne({ where: { token } });
    if (!registerToken) {
      res.status(404).send({ valid: false });
      return;
    }
    res.json({ valid: true });
  } catch (error) {
    console.error('validateRegisterToken:', error);
    res.status(500).send({ valid: false });
  }
}

/**
 * Create a register token.
 * Can only be done by an admin.
 * @async
 * @param {Request} req
 * @param {Response} res
 */
export async function createRegisterToken(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const token = Math.random().toString(36).substring(2, 15);
    await RegisterToken.create({ token });
    res.json({ token });
  } catch (error) {
    console.error('createRegisterToken:', error);
    res.status(500).send({ error: 'Failed to create register token' });
  }
}
