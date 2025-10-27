import ForbiddenError from '../exceptions/ForbiddenError'
import app from './config';

const {clientUrl} = app

const whitelist = [clientUrl]

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (whitelist.includes(origin as string) || !origin) {
      return callback(null, true)
    } else {
      return callback(new ForbiddenError('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}

export default corsOptions
