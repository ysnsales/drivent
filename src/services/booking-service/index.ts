import { notFoundError, unauthorizedError } from "../../errors";
import { forbiddenError } from "../../errors/forbidden-error";
import bookingRepository from "../../repositories/booking-repository";
import enrollmentRepository from "../../repositories/enrollment-repository";
import hotelRepository from "../../repositories/hotel-repository";
import ticketsRepository from "../../repositories/tickets-repository";

async function getBooking( userId:number ){
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw forbiddenError();

    return booking;
};

async function createBooking(userId:number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
  
    if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw forbiddenError();
    };

    const room = await hotelRepository.findRoomById(roomId);
    if (!room) throw notFoundError();

    if (room.Booking.length >= room.capacity) throw forbiddenError();   
    
    const booking = await bookingRepository.createBooking(userId, roomId);

    return {bookingId: booking.id};
};

async function updateBooking(userId: number, roomId:number, bookingId: number) {
    const booking = await bookingRepository.getBooking(userId);
    if (!booking || booking.id !== bookingId) throw forbiddenError();

    const room = await hotelRepository.findRoomById(roomId);
    if (!room) throw notFoundError();

    if (room.Booking.length >= room.capacity) throw forbiddenError();  
  
    const putBooking = await bookingRepository.updateBooking(bookingId, roomId);
    return { bookingId: putBooking.id }
    
}

const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingService;