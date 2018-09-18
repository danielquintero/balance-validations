import {Injectable} from '@angular/core';
import {MT940, CustomerStatement} from '@rabo/file/statement.model';
import {Observable, from} from 'rxjs';
import {filter, find, includes, map} from 'lodash-es';

@Injectable({
	providedIn: 'root'
})
export class StatementValidatorService {
	public validate(records: MT940[]): Observable<CustomerStatement[]> {
		const checkedRefs = this.checkRefs(records);
		const checkedBalance = this.checkBalance(checkedRefs);
		return from([checkedBalance]);
	}

	private checkRefs(records: MT940[]): CustomerStatement[] {
		const duplicateRefs = filter(records, (value: MT940, index: number, iteratee: MT940[]) => {
			return find(iteratee, (v: MT940) => v.reference === value.reference, index + 1);
		});
		const rest = filter(records, (record) => !includes(duplicateRefs, record));
		map(duplicateRefs, (value: MT940) => ({...value}));

		return [
			...(map(duplicateRefs, (record: MT940) => ({
				...record,
				validation: {isValid: false, errors: ['Duplicated statement reference']}
			})) as CustomerStatement[]),
			...(map(rest, (record: MT940) => ({...record, validation: {isValid: true}})) as CustomerStatement[])
		];
	}

	private checkBalance(records: CustomerStatement[]): CustomerStatement[] {
		return records.map((record) => {
			let isValid: boolean;
			const {startBalance, endBalance, mutation, validation} = record;
			const sign = Math.sign(mutation);

			if (sign === NaN) {
				throw new Error('Cannot find the symbol for the mutation type');
			}

			if (sign === 1) {
				isValid = startBalance + mutation === endBalance;
			} else if (sign === -1) {
				isValid = startBalance - Math.abs(mutation) === endBalance;
			}

			if (isValid) {
				return record;
			}
			// set record validity to false
			record.validation.isValid = false;
			const error = 'End Balance is incorrect, wrong mutation applied';
			validation.errors && validation.errors.length > 0
				? record.validation.errors.push(error)
				: (record.validation.errors = [error]);
			return record;
		});
	}
}
