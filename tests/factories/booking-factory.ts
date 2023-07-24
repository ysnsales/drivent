import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createBooking (userId: number, roomId: number){
    return prisma.booking.create({data: {userId, roomId}, select:{id: true}});
};

export async function updateBooking(id: number, roomId: number){
    return prisma.booking.update({data: {roomId}, where: {id}, select:{id: true} })
};

export function createBookingInput() {
    const roomId = +faker.datatype.number();
    return {
        id: +faker.datatype.number(),
        userId: +faker.datatype.number(),
        roomId: roomId,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        Room : {
            id: roomId,
            name: faker.name.jobTitle(),
            capacity: faker.datatype.number(),
            hotelId: +faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent()
        }
    }
  };

