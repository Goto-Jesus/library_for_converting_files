import { FileFormater } from '../FileFormater';
import { Format } from '../types/Format';
import { Car } from '../classes/Car';
import xml2js from 'xml2js';
// import { format } from 'date-fns';

interface CarXML {
	Date: string[];
	BrandName: string[];
	Price: string[];
}

export class XmlFormater extends FileFormater {
	protected toObject(binaryData: Buffer): Format {
		const data = binaryData.toString('utf-8');
		const result: Format = { Document: { Car: [] } };

		xml2js.parseString(data, (err, object) => {
			const carsXml: CarXML[] = object.Document.Car;

			const cars: Car[] = carsXml.map((car) => {
				const { Date: DateXML, BrandName, Price } = car;

				const dateString = DateXML[0];
				const dateParts = dateString.split('.').map(Number);

				const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
				const brandName = BrandName[0];
				const price = Number(Price[0]);

				return new Car(brandName, price, date);
			});

			result.Document.Car = cars;
		});

		return result;
	}

	protected toFormat(objectData: Format) {
		const cars = objectData.Document.Car;

		let xmlData = '<?xml version="1.0" encoding="utf-8"?>\n';
		xmlData += '<Document>\n';

		for (const { date, brandName, price } of cars) {
			const d = new Date(date);
			const dateFomat: string = d.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			}).replace(/[/]/g, '.');

			xmlData += '  <Car>\n';
			xmlData += `    <Date>${dateFomat}</Date>\n`;
			xmlData += `    <BrandName>${brandName}</BrandName>\n`;
			xmlData += `    <Price>${price}</Price>\n`;
			xmlData += '  </Car>\n';
		}

		xmlData += '</Document>';

		return xmlData;
	}
}

FileFormater.addFormat('xml', XmlFormater, new XmlFormater());
