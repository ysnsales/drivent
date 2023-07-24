import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { Address, Enrollment, User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createEnrollmentWithAddress(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.enrollment.create({
    data: {
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId: incomingUser.id,
      Address: {
        create: {
          street: faker.address.streetName(),
          cep: faker.address.zipCode(),
          city: faker.address.city(),
          neighborhood: faker.address.city(),
          number: faker.datatype.number().toString(),
          state: faker.address.state(),
        },
      },
    },
    include: {
      Address: true,
    },
  });
}


export function createhAddressWithCEP() {
  return {
    logradouro: 'Avenida Brigadeiro Faria Lima',
    complemento: 'de 3252 ao fim - lado par',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
  };
}

export function createEnrollmentInput(){
  return {
    id:  +faker.datatype.number(),
    name: faker.name.findName(),
    cpf: '12345678910',
    birthday: new Date(),
    phone: '123456789',
    userId:  +faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    Address: [
      {
        id: 1,
        cep: '68397-4212',
        street: faker.address.streetName(),
        city: faker.address.cityName(),
        state: faker.address.state(),
        number: faker.address.streetAddress(),
        neighborhood: faker.address.state(),
        addressDetail: 'none',
        enrollmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]
  }
}

