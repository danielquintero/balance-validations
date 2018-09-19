import {Injectable} from '@angular/core';
import {MT940, CustomerStatement} from '@rabo/file/statement.model';
import {Observable, from, Observer, of} from 'rxjs';
import {filter, find, includes, map as _map} from 'lodash-es';
import {mergeMap, toArray} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class StatementValidatorService {
	public validate(records: MT940[]): Observable<CustomerStatement[]> {
		const transformed$ = from(records).pipe(mergeMap((record) => this.toCustomerStatement(record)));
		const checkedBalance$ = transformed$.pipe(mergeMap((cs: CustomerStatement) => this.checkBalance(cs)));
		const checkedRefs$ = checkedBalance$.pipe(
			toArray(),
			mergeMap((cs: CustomerStatement[]) => this.checkRefs(cs))
		);
		return checkedRefs$;
	}

	private toCustomerStatement(record: MT940): Observable<CustomerStatement> {
		const {accountNumber, mutation, reference, endBalance, startBalance, description} = record;
		return of(new CustomerStatement(reference, accountNumber, startBalance, mutation, description, endBalance));
	}

	private checkRefs(records: CustomerStatement[]): Observable<CustomerStatement[]> {
		return Observable.create((observer: Observer<CustomerStatement[]>) => {
			try {
				const duplicateRefs = filter(records, (value: MT940, index: number, iteratee: MT940[]) => {
					return find(iteratee, (v: MT940) => v.reference === value.reference, index + 1);
				});
				const rest = filter(records, (record) => !includes(duplicateRefs, record));
				observer.next([
					..._map(duplicateRefs, (record: MT940) => ({
						...record,
						validation: {isValid: false, errors: ['Duplicated statement reference']}
					})),
					...rest
				]);
				observer.complete();
			} catch (error) {
				observer.error(`Failed validating 'unique' references`);
				observer.complete();
			}
		});
	}

	private checkBalance(record: CustomerStatement): Observable<CustomerStatement> {
		return Observable.create((observer: Observer<CustomerStatement>) => {
			try {
				let isValid: boolean;
				const {startBalance, endBalance, mutation, validation} = record;
				const sign = Math.sign(mutation);

				if (sign === NaN) {
					observer.error('Cannot find the symbol for the mutation type');
					observer.complete();
				}

				if (sign === 1) {
					isValid = Math.round((startBalance + mutation) * 100) / 100 === endBalance;
				} else if (sign === -1) {
					isValid = Math.round((startBalance - Math.abs(mutation)) * 100) / 100 === endBalance;
				}

				if (!isValid) {
					// set record validity to false
					const error = 'End Balance is incorrect';
					validation.isValid = false;
					validation.errors.push(error);
				}

				observer.next(record);
				observer.complete();
			} catch (error) {
				observer.error('Failed validating balance');
				observer.complete();
			}
		});
	}
}
