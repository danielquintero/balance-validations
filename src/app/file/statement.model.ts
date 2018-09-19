export interface MT940 {
	reference: string;
	accountNumber: string;
	startBalance: number;
	mutation: number;
	description: string;
	endBalance: number;
}
export class CustomerStatement implements MT940 {
	public validation: Validation = {isValid: true, errors: []};
	constructor(
		public reference: string,
		public accountNumber: string,
		public startBalance: number,
		public mutation: number,
		public description: string,
		public endBalance: number
	) {}
}
interface Validation {
	isValid: boolean;
	errors: string[];
}
