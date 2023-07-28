import { FileFormater } from '../FileFormater';
import { Format } from '../types/Format';

export class JsonFormater extends FileFormater {
	protected toObject(bufferData: Buffer): Format {
		const data = bufferData.toString('utf-8');

		return JSON.parse(data);
	}

	protected toFormat(objectData: Format) {
		const jsonData = JSON.stringify(objectData);

		return jsonData;
	}
}

FileFormater.addFormat('.json', JsonFormater, new JsonFormater());
