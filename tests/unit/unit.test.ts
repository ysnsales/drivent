
import bookingService from "@/services/booking-service";
import { createBookingInput } from '../factories/booking-factory';
import bookingRepository from '@/repositories/booking-repository';
import { createTicketInput } from "../factories";
import { TicketStatus } from "@prisma/client";
import ticketsRepository from "../repositories/tickets-repository";

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
    it("should throw an error when ticket type is remote", async () =>{
        const ticket = createTicketInput(true, false, TicketStatus.RESERVED);
        jest.spyOn(ticketsRepository, "findTicketsByUserId").mockResolvedValue(ticket);

    })

})