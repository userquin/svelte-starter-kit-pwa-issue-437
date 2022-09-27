import { faker } from '@faker-js/faker';
import type { Member, Address, Phone } from '$lib/models/types/member';

export function createRandomPhone(): Phone {
	return {
		number: faker.phone.number(),
		type: faker.helpers.arrayElement(['1', '2'])
	};
}

export function createRandomAddress(): Address {
	return {
		type: faker.helpers.arrayElement(['MAILING', 'SHIPPING']),
		street: faker.address.streetAddress(),
		city: faker.address.cityName(),
		state: faker.address.state(),
		zip: faker.address.zipCodeByState('CA')
	};
}

export function createRandomMember(): Member {
	return {
		id: faker.datatype.uuid(),
		firstName: faker.name.firstName(),
		middleName: faker.name.middleName(),
		lastName: faker.name.lastName(),
		dob: faker.date.birthdate().toDateString(),
		gender: faker.name.sex(),
		address: [...Array(2)].map((_) => createRandomAddress()),
		phone: [...Array(2)].map((_) => createRandomPhone())
	};
}

export function createData(length = 10) {
	return [...Array(length)].map((_) => createRandomMember());
}

export const MEMBERS: Member[] = createData(10);
