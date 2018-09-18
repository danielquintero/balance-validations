import {Injectable} from '@angular/core';
import {MT940, CustomerStatement} from '@rabo/file/statement.model';
import {Observable, from} from 'rxjs';
import {filter, find, includes, map} from 'lodash-es';

@Injectable({
	providedIn: 'root'
})
export class StatementValidatorService {
	public validate(records: MT940[]): Observable<CustomerStatement[]> {
		const duplicateRefs = filter(records, (value: MT940, index: number, iteratee: MT940[]) => {
			return find(iteratee, (v: MT940) => v.reference === value.reference, index + 1);
		});
		const rest = filter(records, (record) => !includes(duplicateRefs, record));
		map(duplicateRefs, (value: MT940) => ({...value}));

		const customerStatement = [
			...(map(duplicateRefs, (record: MT940) => ({
				...record,
				validation: {isValid: false, errors: ['Duplicated statement reference']}
			})) as CustomerStatement[]),
			...(map(rest, (record: MT940) => ({...record, validation: {isValid: true}})) as CustomerStatement[])
		];
		return from([customerStatement]);
	}
}
