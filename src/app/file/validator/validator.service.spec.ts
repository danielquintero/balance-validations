import {cold, hot} from 'jasmine-marbles';
import {StatementValidatorService} from './validator.service';

describe('StatementValidatorService', () => {
	let service: StatementValidatorService;
	let toCustomerStatementFn: jasmine.Spy;
	let checkRefsFn: jasmine.Spy;
	let checkBalanceFn: jasmine.Spy;

	beforeEach(() => {
		service = new StatementValidatorService();
		toCustomerStatementFn = jasmine.createSpy();
		checkRefsFn = jasmine.createSpy();
		checkBalanceFn = jasmine.createSpy();
	});

	describe('validate', () => {
		it('collects all emitied values of inner streams and then emits them alltogether', (done: any) => {
			// Arrange
			const values = {a: 1, b: 2, c: 3};
			const expected = cold('----abc|', values);

			toCustomerStatementFn.and.callFake(() => {
				return cold('-a|', values);
			});
			checkBalanceFn.and.callFake(() => {
				return cold('-b|', values);
			});
			checkRefsFn.and.callFake(() => {
				return cold('-abc|', values);
			});
			service['toCustomerStatement'] = toCustomerStatementFn;
			service['checkBalance'] = checkBalanceFn;
			service['checkRefs'] = checkRefsFn;

			// Act
			const sub = service.validate([1, 2] as any);

			// Assert
			sub.subscribe((result: any) => {
				// expect(result).toEqual(3);
				done();
			});
			expect(sub).toBeObservable(expected);
		});
	});

	describe('toCustomerStatement', () => {
		it('creates a new customer statement instance and completes', (done: any) => {
			// Arrange
			const source = {
				reference: 'reference',
				accountNumber: 'accountNumber',
				startBalance: 1,
				mutation: -1,
				description: 'description',
				endBalance: 0
			};

			// Act
			const sub = service['toCustomerStatement'](source);

			// Assert
			sub.subscribe((val) => {
				expect({...val}).toEqual({...source, validation: {isValid: true, errors: []}});
				done();
			});
		});
	});

	describe('checkRefs', () => {
		it('validates unique references', (done: any) => {
			// Arrange
			const source = [
				{
					reference: 'reference',
					accountNumber: 'accountNumber1',
					startBalance: 1,
					mutation: -1,
					description: 'description1',
					endBalance: 0,
					validation: {isValid: true, errors: []}
				},
				{
					reference: 'reference',
					accountNumber: 'accountNumber2',
					startBalance: 1,
					mutation: +1,
					description: 'description2',
					endBalance: 1,
					validation: {isValid: true, errors: []}
				}
			];

			// Act
			const sub = service['checkRefs'](source);

			// Assert
			sub.subscribe((result) => {
				expect(!!result.find((val) => !val.validation.isValid)).toBe(true);
				done();
			});
		});
	});
	describe('checkBalance', () => {
		it('validates end balance after mutation', (done: any) => {
			// Arrange
			const source = {
				reference: 'reference',
				accountNumber: 'accountNumber1',
				startBalance: 1,
				mutation: -1,
				description: 'description1',
				endBalance: 0,
				validation: {isValid: true, errors: []}
			};

			// Act
			const sub = service['checkBalance'](source);

			// Assert
			sub.subscribe((result) => {
				expect(result.validation.isValid).toBe(true);
				expect(result.validation.errors.includes('End Balance is incorrect')).toBe(false);
				done();
			});
		});
	});
});
