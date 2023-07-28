'use strict';
//*		Example 1

import { Car } from './classes/Car';
import { JsonFormater } from './formates/json';
import { XmlFormater } from './formates/xml';

const xml = new XmlFormater();
//	The file is read and converted into an array to work with the state of cars
xml.read('cars.xml');

// 	3 options for change state of cars.
xml.add('BMW', 70_999);									// create a new car
xml.remove(0);													// delete a car by index
xml.edit(1, new Car('Audi', 40_500));		// replace a car by index

//	Writes a new file to a directory
xml.write('cars2.xml');										//	will appear in the "files" folder as "cars2.xml"

//	2 options for method "convertTo"
xml.convertTo(new JsonFormater);					// 	will appear in the "files" folder as "converted.json"
xml.convertTo(new JsonFormater, 'cars3');	//	will appear in the "files" folder as "cars3-converted.json"

//	"console.log" for your state of cars.	Check you terminal :)
xml.show();

//	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	*/

/*		Example 2

import { BinaryFormater } from './formates/binary';
import { XmlFormater } from './formates/xml';

const bin = new BinaryFormater();

//	You can create a new state of cars without reading the file...

// bin.add('Ferrari', 300_000);
// bin.add('Lamborghini', 600_000);
// bin.add('Bugatti', 2_500_000);
// bin.write('sport-cars.bin');

//	You can immediately convert the file without reading the file...
bin.convertFile('sport-cars.bin', new XmlFormater);

//	┌───[ File Size Difference: ]─────┐
//	│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
//	├─> sport-cars.bin      98 bytes  │
//	├─> sport-cars.json     247 bytes │
//	├─> sport-cars.xml      384 bytes │
//	└─────────────────────────────────┘

//	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	*/

