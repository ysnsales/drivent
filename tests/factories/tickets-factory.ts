import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote ? isRemote : false,
      includesHotel: includesHotel ? includesHotel : false,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createTicketInput( isRemote: boolean, includesHotel: boolean, status: TicketStatus) {
  const typeId = +faker.datatype.number();
  return ({
    id: +faker.datatype.number(),
    ticketTypeId: typeId,
    enrollmentId: +faker.datatype.number(),
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
        id: typeId,
        name: faker.name.findName(),
        price: +faker.datatype.number(),
        isRemote,
        includesHotel,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
} as (Ticket & { TicketType: TicketType; }))
  
}
