import {DataTableComponent} from './data-table.component';
import {Store} from '@ngrx/store';
import {of, Subscription} from 'rxjs';

describe('DataTableComponent', () => {
	let component: DataTableComponent;
	let store: jasmine.SpyObj<Store<any>>;
	let initFn: jasmine.Spy;

	beforeEach(() => {
		store = jasmine.createSpyObj('Store', ['select', 'dispatch']);
		component = new DataTableComponent(store);
		initFn = spyOn(component as any, 'init').and.callFake(init);
	});
	describe('ngOnInit', () => {
		it('calls init', () => {
			// Act
			component.ngOnInit();
			// Assert
			expect(initFn).toHaveBeenCalled();
			expect(component['subscriptions'].closed).toBe(false);
		});
	});
	describe('ngOnDestroy', () => {
		beforeEach(() => {
			component.ngOnInit();
		});
		it('unsubscribes', () => {
			// Arrange
			const subscriptionsAddFn = spyOn(component['subscriptions'], 'unsubscribe');
			// Act
			component.ngOnDestroy();
			// Assert
			expect(subscriptionsAddFn).toHaveBeenCalled();
		});
	});
	const init = () => {
		component['subscriptions'] = new Subscription();
		const recordMock = [
			{
				accountNumber: 'NL74ABNA0248990274',
				description: 'Candy from Jan de Vries',
				endBalance: 85.81,
				mutation: -23.94,
				reference: '112806',
				startBalance: 109.75,
				validation: {isValid: false, errors: ['Duplicated statement reference']}
			}
		];
		component.records$ = of(recordMock);
		component['subscriptions'].add(component.records$.subscribe((val) => console.log(val)));
	};
});
