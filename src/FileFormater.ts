import fs from 'fs';
import path from 'path';
import { Car } from './classes/Car';
import { Format } from './types/Format';

interface Formats {
	formatName: string;
	formatter: typeof FileFormater;
	exemplar: FileFormater;
}

export abstract class FileFormater {
	static formats: Formats[] = [];

	static addFormat(
		formatName: string,
		formatter: typeof FileFormater,
		exemplar: FileFormater,
	) {
		if (formatName[0] !== '.') {
			formatName = '.' + formatName;
		}

		FileFormater.formats.push({ formatName, formatter, exemplar });
	}

	constructor(protected cars: Car[] = []) {}

	private getCars() {
		return this.cars;
	}

	private setCars(cars: Car[]) {
		this.cars = cars;
	}

	read(fileName: string): void {
		try {
			const bufferData = fs.readFileSync(path.resolve(__dirname, 'files', fileName));
			const objectData = this.toObject(bufferData);

			this.setCars(objectData.Document.Car);
		} catch (err) {
			throw new Error(`File not found!!! ${err}`);
		}
	}

	write(fileName: string): void {
		const { ext, name } = path.parse(fileName);
		const outputExemplar = FileFormater.formats.find(
			({ formatName }) => formatName === ext,
		)?.exemplar;

		if (!outputExemplar) {
			throw new Error('Invalid format');
		}

		const objectData: Format = { Document: { Car: this.cars } };

		const convertedData = outputExemplar.toFormat(objectData);
		fs.writeFileSync(path.resolve(__dirname, 'files', name + ext), convertedData);
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

	convertTo(outputFormat: FileFormater, fileName = '') {
		if (!outputFormat) {
			throw new Error('Invalid output format');
		}

		const ext = FileFormater.formats.find(
			({ formatter }) => outputFormat instanceof formatter,
		)?.formatName;

		const objectData: Format = { Document: { Car: this.getCars() } };
		const convertedData = outputFormat.toFormat(objectData);
		const hyphen = fileName ? '-' : '';
		const name = fileName.split('.')[0];

		fs.writeFileSync(
			path.resolve(
				__dirname,
				'files',
				`${name + hyphen}converted${ext}`,
			),
			convertedData,
		);
	}

	convertFile(fileName: string, outputFormat: FileFormater) {
		const { ext, name } = path.parse(fileName);
		const inputExemplar = FileFormater.formats.find(
			({ formatName }) => formatName === ext,
		)?.exemplar;

		if (!inputExemplar) {
			throw new Error('Invalid input format');
		}

		inputExemplar.read(fileName);

		this.convertTo.call(inputExemplar, outputFormat, name);
	}

	show() {
		console.log(this.getCars());
	}

	protected abstract toObject(bufferData: Buffer): Format;
	protected abstract toFormat(objectData: Format): any;
}
