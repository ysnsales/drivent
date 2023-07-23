import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import bookingController from '../controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', bookingController.getBooking)
  .post('/', bookingController.createBooking)
  .put('/', bookingController.updateBooking);

export { bookingRouter };