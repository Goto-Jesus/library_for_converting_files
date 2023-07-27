export class Car {
	constructor(
		public brandName: string,
		public price: number,
		public date: Date = new Date(),
	) {}
}
