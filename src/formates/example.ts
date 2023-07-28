import { FileFormater } from '../FileFormater';
import { Format } from '../types/Format';

export class ExampleFormater extends FileFormater {
	protected toObject(bufferData: Buffer): Format {
		console.log(bufferData);

		return { Document: { Car: [] } };
	}

	protected toFormat(objectData: Format) {
		console.log(objectData);

		// return covertedData;
	}
}

FileFormater.addFormat('.example', ExampleFormater, new ExampleFormater());	// <--- Necessarily!!!
