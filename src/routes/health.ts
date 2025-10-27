import { Request, Response,Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router()

router.get('/', (_: Request, res: Response): void => {
  res.status(StatusCodes.OK).json({
      "response": "ok"
    });
})

export default router
