import {FileActions} from '@rabo/file/store/actions';
import {UploadSuccess, Validate} from './file.actions';
import {ReadFile} from '@rabo/file/file.model';
describe('Upload', () => {
	it('creats an upload action', () => {
		// Arrange
		const payload = {} as any;
		// Act
		const action = new FileActions.Upload(payload);
		// Assert
		expect({...action}).toEqual({
			type: FileActions.FileActionTypes.Upload,
			payload
		});
	});
});

describe('UploadSuccess', () => {
	it('creates an UploadSuccess action', () => {
		// Arrange
		const data = new Blob(['content']);
		const arrayOfBlob = new Array<Blob>(data);
		const file = new File(arrayOfBlob, `test.csv`, {type: 'txt/csv'});
		const payload = [{...file, contents: 'some content'} as ReadFile];
		// Act
		const action = new FileActions.UploadSuccess(payload);
		// Assert
		expect({...action}).toEqual({
			type: FileActions.FileActionTypes.UploadSuccess,
			payload
		});
	});
});

describe('Validate', () => {
	it('creates an Validate action', () => {
		// Arrange
		const payload = [
			{
				reference: 'string',
				accountNumber: 'string',
				startBalance: 0,
				mutation: 1,
				description: 'string',
				endBalance: 0
			}
		];
		// Act
		const action = new FileActions.Validate(payload);
		// Assert
		expect({...action}).toEqual({
			type: FileActions.FileActionTypes.Validate,
			payload
		});
	});
});

describe('ValidateSuccess', () => {
	it('creates an ValidateSuccess action', () => {
		// Arrange
		const payload = [
			{
				reference: 'string',
				accountNumber: 'string',
				startBalance: 0,
				mutation: 1,
				description: 'string',
				endBalance: 0,
				validation: {
					isValid: true
				}
			}
		];
		// Act
		const action = new FileActions.ValidateSuccess(payload);
		// Assert
		expect({...action}).toEqual({
			type: FileActions.FileActionTypes.ValidateSuccess,
			payload
		});
	});
});
