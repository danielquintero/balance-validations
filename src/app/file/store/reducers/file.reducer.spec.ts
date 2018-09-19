import * as fromFile from '@rabo/file/store/reducers/file.reducer';
import {FileActions} from '@rabo/file/store/actions';

describe('FilesReducer', () => {
	let initialState: any;
	beforeEach(() => {
		initialState = fromFile.initialState;
	});
	describe('undefined action', () => {
		it('returns the default state', () => {
			const action = {} as any;
			const state = fromFile.reducer(undefined, action);

			expect(state).toBe(initialState);
		});
	});
	describe('UploadSuccess', () => {
		it('adds the uploaded files to the store', () => {
			const payload = [{} as any];
			const action = new FileActions.UploadSuccess(payload);
			const state = fromFile.reducer(initialState, action);

			expect(state).toEqual({...initialState, files: payload});
		});
		it('sets upload error to null', () => {
			const payload = [{} as any];
			const action = new FileActions.UploadSuccess(payload);
			const state = fromFile.reducer({...initialState, uploadError: 'Error'}, action);

			expect(state.uploadError).toBe(null);
		});
	});
	describe('UploadFailure', () => {
		it('sets upload error', () => {
			const payload = 'This is an error';
			const action = new FileActions.UploadFailure(payload);
			const state = fromFile.reducer(initialState, action);

			expect(state).toEqual({...initialState, uploadError: payload});
		});
	});
	describe('ValidateSuccess', () => {
		it('adds validated records', () => {
			const payload = {} as any;
			const action = new FileActions.ValidateSuccess(payload);
			const state = fromFile.reducer(initialState, action);

			expect(state).toEqual({...initialState, records: payload});
		});
		it('sets validation error to null', () => {
			const payload = [{} as any];
			const action = new FileActions.ValidateSuccess(payload);
			const state = fromFile.reducer({...initialState, validationError: 'Error'}, action);

			expect(state.validationError).toBe(null);
		});
	});
	describe('ValidateFailure', () => {
		it('set validation error', () => {
			const payload = 'This is an error';
			const action = new FileActions.ValidateFailure(payload);
			const state = fromFile.reducer(initialState, action);

			expect(state).toEqual({...initialState, validationError: payload});
		});
	});
});
