export interface MT940 {
	reference: string;
	accountNumber: string;
	startBalance: number;
	mutation: number;
	description: string;
	endBalance: number;
}
export interface CustomerStatement extends MT940 {
	validation: Validation;
}
interface Validation {
	isValid: boolean;
	errors?: string[];
}
