import fs from 'fs';
import path from 'path';
import { Car } from './classes/Car';
import { Format } from './types/Format';

interface Formats {
	formatName: string;
	exemplar: FileFormater;
	formatter: typeof FileFormater;
}

export abstract class FileFormater {
	static formats: Formats[] = [];

	constructor(protected cars: Car[] = []) {}

	private getCars() {
		return this.cars;
	}

	private setCars(cars: Car[]) {
		this.cars = cars;
	}

	static addFormat(
		formatName: string,
		formatter: typeof FileFormater,
		exemplar: FileFormater,
	) {
		FileFormater.formats.push({ formatName, formatter, exemplar });
	}

	read(fileName: string): void {
		try {
			const data = fs.readFileSync(path.resolve(__dirname, 'files', fileName));
			const object = this.toObject(data);

			this.setCars(object.Document.Car);
		} catch (err) {
			throw new Error(`File not found!!! ${err}`);
		}
	}

	write(fileName: string): void {
		const { ext } = path.parse(fileName);
		const fileFormat = ext.slice(1);

		const hasFormat = FileFormater.formats.find(
			({ formatName }) => formatName === fileFormat,
		);

		if (!hasFormat) {
			throw new Error('Invalid format');
		}

		const objectData: Format = { Document: { Car: this.cars } };

		const convertedData = hasFormat.exemplar.toFormat(objectData);
		fs.writeFileSync(
			path.resolve(__dirname, 'files', fileName),
			convertedData,
		);
	}

	add(brandName: string, price: number, date: Date = new Date()) {
		const newCar = new Car(brandName, price, date);
		this.cars.push(newCar);
	}

	remove(index: number) {
		if (index >= 0 && index < this.cars.length) {
			this.setCars(this.cars.filter((_, i) => i !== index));

			return;
		}

		throw new Error('Index out of range');
	}

	edit(index: number, car: Car) {
		if (index >= 0 && index < this.cars.length) {
			this.cars[index] = car;

			return;
		}

		throw new Error('Index out of range');
	}

	convertTo(outputFormat: FileFormater) {
		if (!outputFormat) {
			throw new Error('Invalid output format');
		}

		const outputFormatName = FileFormater.formats.find(
			({ formatter }) => outputFormat instanceof formatter,
		)?.formatName;

		const objectData: Format = { Document: { Car: this.cars } };
		const convertedData = outputFormat.toFormat(objectData);
		fs.writeFileSync(
			path.resolve(__dirname, 'files', `converted.${outputFormatName}`),
			convertedData,
		);
	}

	convertFile(fileName: string, outputFormat: FileFormater) {
		const { ext, name } = path.parse(fileName);
		const inputFormatName = ext.slice(1);

		const outputFormatName = FileFormater.formats.find(
			({ formatter }) => outputFormat instanceof formatter,
		)?.formatName;

		const inputFormater = FileFormater.formats.find(
			({ formatName }) => formatName === inputFormatName,
		)?.exemplar;

		// console.log(FileFormater.formats);

		if (!inputFormater) {
			throw new Error('Invalid input format');
		}

		if (!outputFormat) {
			throw new Error('Invalid output format');
		}

		inputFormater.read(fileName);
		const objectData = { Document: { Car: inputFormater.getCars() } };
		const convertedData = outputFormat.toFormat(objectData);
		fs.writeFileSync(
			path.resolve(__dirname, 'files', `${name}-converted.${outputFormatName}`),
			convertedData,
		);
	}

	show() {
		console.log(this.getCars());
	}

	protected abstract toObject(binaryData: Buffer): Format;
	protected abstract toFormat(objectData: Format): any;
}
