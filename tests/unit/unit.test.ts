
import bookingService from "@/services/booking-service";
import { createBookingInput } from '../factories/booking-factory';
import bookingRepository from '@/repositories/booking-repository';
import { createEnrollmentInput, createTicketInput } from "../factories";
import { TicketStatus } from "@prisma/client";
import ticketsRepository from "../repositories/tickets-repository";
import enrollmentRepository from "../repositories/enrollment-repository";

beforeEach(async () => {
    jest.clearAllMocks();
});

describe("get booking", () => {
    it("should throw an error when user does not have a booking", async () => {
        const booking = createBookingInput();
        jest.spyOn(bookingRepository, "getBooking").mockResolvedValueOnce(undefined);
        
        const promise = bookingService.getBooking(booking.userId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    });
    
});

describe("create booking", () => {
    it('should return not found error if user does not have an enrollment', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null);

        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
      });

    it('should return not found error if user does not have a ticket', async () => {
        const enrollment = createEnrollmentInput();
        //jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollment);
        jest.spyOn(ticketsRepository, 'findTicketsByUserId').mockResolvedValue(null);
    
        const promise = bookingService.createBooking(1, 1);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
      });

    it("should throw an error when ticket type is remote", async () =>{
        const ticket = createTicketInput(true, false, TicketStatus.RESERVED);
        jest.spyOn(ticketsRepository, "findTicketsByUserId").mockResolvedValue(ticket);

        const promise = bookingService.createBooking(1, 1);
        
        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You do not have permission to do this action',});
      });
    
    it('should return forbidden error if user ticket does not includes hotel', async () => {
        const ticket = createTicketInput(false, false, TicketStatus.PAID)
        jest.spyOn(ticketsRepository, 'findTicketsByUserId').mockResolvedValue(ticket);
    
        const promise = bookingService.createBooking(1, 1);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You do not have permission to do this action',});
      });

    it('should return forbidden error if user ticket is not paid', async () => {
        const ticket = createTicketInput(false, true, TicketStatus.RESERVED)
        jest.spyOn(ticketsRepository, 'findTicketsByUserId').mockResolvedValue(ticket);
    
        const promise = bookingService.createBooking(1, 1);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You do not have permission to do this action',});
    });

});

describe("update booking", () => {
    it('should return forbidden error if user does not have a booking', async () => {
        jest.spyOn(bookingRepository, 'getBooking').mockResolvedValue(null);
        const promise = bookingService.createBooking(1, 1);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'You do not have permission to do this action',});
      });

});

