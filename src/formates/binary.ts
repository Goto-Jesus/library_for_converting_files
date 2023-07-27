import { FileFormater } from '../FileFormater';
import { Format } from '../types/Format';
import { Car } from '../classes/Car';

export class BinaryFormater extends FileFormater {
	protected toObject(binaryData: Buffer): Format {
		// const header = binaryData.slice(0, 2);
		const carCount = binaryData.readUInt32LE(2);
		const cars: Car[] = [];

		let offset = 6; // Start reading after header and carCount (2 + 4)

		for (let i = 0; i < carCount; i++) {
			const date = new Date();
			date.setDate(binaryData.readUInt16LE(offset)); // DD
			date.setMonth(binaryData.readUInt16LE(offset + 2) - 1); // MM (Note: Months are zero-indexed in JavaScript)
			date.setFullYear(binaryData.readUInt32LE(offset + 4)); // YYYY

			offset += 8; // Move to the next car field

			const brandNameLength = binaryData.readUInt16LE(offset);
			offset += 2; // Move to the brandName field

			const brandName = binaryData.toString(
				'utf16le',
				offset,
				offset + brandNameLength * 2,
			);
			offset += brandNameLength * 2; // Move to the next car field

			const price = binaryData.readInt32LE(offset);
			offset += 4; // Move to the next car field

			// Create the car object and add it to the cars array
			const car = new Car(brandName, price, date);

			cars.push(car);
		}

		return {
			Document: {
				Car: cars,
			},
		};
	}

	protected toFormat(objectData: Format) {
		const header = Buffer.from([0x25, 0x26]);
		const carCount = Buffer.alloc(4);
		const carData: Buffer[] = [];

		// Convert the car objects to binary format
		objectData.Document.Car.forEach((car) => {
			const date = Buffer.alloc(8);
			const brandName = Buffer.from(car.brandName, 'utf16le');
			const brandNameLength = Buffer.alloc(2);
			const price = Buffer.alloc(4);

			// Convert Date to binary format (DDMMYYYY)
			const dateObject = new Date(car.date);
			date.writeUInt16LE(dateObject.getDate(), 0); // DD
			date.writeUInt16LE(dateObject.getMonth() + 1, 2); // MM (Note: Months are zero-indexed in JavaScript)
			date.writeUInt32LE(dateObject.getFullYear(), 4); // YYYY

			// Convert Brand Name Length to binary format
			brandNameLength.writeUInt16LE(brandName.length / 2, 0);

			// Convert Price to binary format
			price.writeInt32LE(car.price, 0);

			// Concatenate the buffers for each car
			carData.push(Buffer.concat([date, brandNameLength, brandName, price]));
		});

		// Convert the car count to binary format
		carCount.writeInt32LE(objectData.Document.Car.length, 0);

		// Concatenate all the buffers in the required order
		const binaryData = Buffer.concat([header, carCount, ...carData]);

		return binaryData;
	}
}

FileFormater.addFormat('bin', BinaryFormater, new BinaryFormater());
