# Node.js with TypeScript

Library for converting files!!!

## Project Creation

Clone this repo into the directory.

```bash
$ npm install
```
## Commands
Run code and test the Library)

```bash
$ npm start
```

## Describtion

In collapsed "formats" you can insert your own formatters.
such files as (binary.ts, xml.ts) and others ...
look in the file example.ts and try)

### How use:
Implemet formater.
```code
// create xml file

const xml = new XmlFormater();

xml.add('Ford', 10000);
xml.add('BMW', 15000);

xml.write('list of cars.xml');	// in the "files" folder you can find this file.)
```
Reading files
```code
const xml = new XmlFormater();

xml.read('list of cars.xml')

xml.show(); // you can see an array of objects in your terminal.
```
Convert file
```code
const xml = new XmlFormater();

xml.read('list of cars.xml');

xml.convertTo(new JsonFormater); // in the "files" folder you can find a file called "convreted.json".
```

Of course, you can modify the file using the following methods: add, delete, and edit.
And you can (read, write) files with the formats you implemented!

## Video Demostration my Project
Check it out for sure!!!

[Video](https://www.loom.com/share/ce712488f7f74c14ac2597768f04b1f0)
