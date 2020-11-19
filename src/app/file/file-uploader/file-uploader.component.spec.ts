import {FileUploaderComponent} from './file-uploader.component';
import {Store} from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of, Subscription} from 'rxjs';
import {ReadFile} from '../file.model';

describe('FileUploaderComponent', () => {
	let component: FileUploaderComponent;
	let store: jasmine.SpyObj<Store<any>>;
	let snackBar: jasmine.SpyObj<MatSnackBar>;
	let initFn: jasmine.Spy;

	beforeEach(() => {
		store = jasmine.createSpyObj('Store', ['select', 'dispatch']);
		snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
		component = new FileUploaderComponent(store, snackBar);
		initFn = spyOn(component as any, 'init').and.callFake(init);
	});
	describe('ngOnInit', () => {
		it('initializes subscriptions', () => {
			// Act
			component.ngOnInit();
			// Assert
			expect(initFn).toHaveBeenCalled();
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
	describe('uploadFiles', () => {
		beforeEach(() => {
			component.ngOnInit();
		});
		it('sets listeners for native element', () => {
			// This is not fit for isolated testing :(
		});
	});
	const init = () => {
		component['subscriptions'] = new Subscription();
		const fileMock = [{name: 'text/csv'}, {name: 'text/xml'}] as ReadFile[];
		component.files$ = of(fileMock);
		component.uploadError$ = of(null);
	};
});
