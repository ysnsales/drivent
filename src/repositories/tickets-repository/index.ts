import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

export async function findTicketsByUserId(userId: number) {
  return await prisma.ticket.findMany({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      TicketType: true,
    }
  })
}


async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: ticket,
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    },
  });
}

async function findTickeWithTypeById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

export default {
  findTicketTypes,
  findTicketByEnrollmentId,
  findTicketsByUserId,
  createTicket,
  findTicketById,
  findTickeWithTypeById,
  ticketProcessPayment,
};
