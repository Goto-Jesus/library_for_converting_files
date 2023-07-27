import { FileFormater } from '../FileFormater';
import { Format } from '../types/Format';

export class JsonFormater extends FileFormater {
	protected toObject(binaryData: Buffer): Format {
		const data = binaryData.toString('utf-8');

		return JSON.parse(data);
	}

	protected toFormat(objectData: Format) {
		const binaryData = JSON.stringify(objectData);

		return binaryData;
	}
}

FileFormater.addFormat('json', JsonFormater, new JsonFormater());
