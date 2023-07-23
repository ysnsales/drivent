import { prisma } from "../../config";

function getBooking (userId: number){
    return prisma.booking.findFirst({where: {userId}, select: {id: true, Room: true}});
};

function createBooking (userId: number, roomId: number){
    return prisma.booking.create({data: {userId, roomId}, select:{id: true}});
};

function updateBooking(id: number, roomId: number){
    return prisma.booking.update({data: {roomId}, where: {id}, select:{id: true} })
};

const bookingRepository = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingRepository;