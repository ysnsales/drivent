import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import bookingService from "../services/booking-service";
import { Response } from "express";

async function getBooking (req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
      const booking = await bookingService.getBooking(userId);
      return res.status(httpStatus.OK).send(booking);

    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(404);
      }
      if (error.name === 'ForbiddenError') {
        return res.sendStatus(403);
      }
      return res.status(403).send('Cannot get booking');
    }
  };

async function createBooking (req: AuthenticatedRequest, res: Response) {
    const { userId } = req;   
    const { roomId } : { roomId: number } = req.body;
    try {
      const booking = await bookingService.createBooking(userId, roomId);
      return res.status(httpStatus.OK).send(booking);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(404);
    }
      if (error.name === 'ForbiddenError') {
        return res.sendStatus(403)
      }
      return res.sendStatus(403);
    }
  };

async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } : { roomId: number } = req.body;
    const bookingId = Number(req.params.bookingId);

    try {
      const booking = await bookingService.updateBooking(userId, roomId, bookingId);
      return res.status(httpStatus.OK).send(booking);

    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(404);
      }
      if (error.name === 'ForbiddenError') {
        return res.sendStatus(403);
      }
      return res.sendStatus(403);
    }
  };

const bookingController = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingController;