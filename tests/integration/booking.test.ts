import app, { init } from '@/app';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from '../factories';
import { TicketStatus } from '@prisma/client';
import { createBooking } from '../factories/booking-factory';

beforeAll(async () => {
    await init();
  });
  
beforeEach(async () => {
    await cleanDb();
  });
  
const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/booking');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
        it('should respond with status 404 when user does not have a booking', async () => {
            const token = await generateValidToken();
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });

        it('should respond with booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
            await createPayment(ticket.id, ticketType.price);
    
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id, 1);
            const booking = await createBooking(user.id, room.id)
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.OK);
          });
 

    });
  });

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

    describe('when token is valid', () => {    
      it('should respond with status 403 when user ticket is remote ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
      
      it('should respond with status 403 when ticket type does not includes hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it('should respond with status 403 when ticket is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
    
      it('should respond with status 404 when room does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
  
        await createHotel();
   
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 403 when room is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);

        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id, 0);

        await createBooking(user.id, room.id);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it('should respond with status 200 and booking id', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketType(false, true);
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);    
            
          await createPayment(ticket.id, ticketType.price);

          const hotel = await createHotel();
          const room = await createRoomWithHotelId(hotel.id, 3);
            
          const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id});
      
          expect(response.status).toBe(httpStatus.OK);
      });
 
    });
  });

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
  
    describe('when token is valid', () => {
      it('should respond with status 404 when room does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
  
        await createHotel();
   
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 403 when room is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);

        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id, 0);

        await createBooking(user.id, room.id);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it('should respond with status 200 and booking id', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);    
        
        await createPayment(ticket.id, ticketType.price);

        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id, 1);
        const newRoom = await createRoomWithHotelId(hotel.id, 2);
        const booking = await createBooking(user.id, room.id);
  
        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: newRoom.id });
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({ bookingId: booking.id, });
      });
    });
  });