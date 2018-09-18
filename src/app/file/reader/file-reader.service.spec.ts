import {cold, hot} from 'jasmine-marbles';
import {FileReaderService} from '@rabo/file/reader/file-reader.service';

describe('FileReaderService', () => {
	let service: FileReaderService;

	beforeEach(() => {
		service = new FileReaderService();
	});

	describe('readFilesParallel', () => {
		it('runs in parallel and returns immediatly for each completion', () => {
			// Arrange
			const values = {a: 1, b: 2};
			const obs1 = cold('-a|', values);
			const obs2 = cold('--b|', values);
			const expected = cold('-ab|', values);
			const readFileFn = jasmine.createSpy();

			readFileFn.and.callFake((file: any) => {
				return file === 1 ? obs1 : obs2;
			});
			service.readFile = readFileFn;

			// Act
			const result = service.readFilesInParallel([1, 2] as any);

			// Assert
			expect(result).toBeObservable(expected);
			expect(readFileFn).toHaveBeenCalledTimes(2);
		});
	});

	describe('readFilesAsArray', () => {
		it('returns the file array when all are completed', () => {
			// Arrange
			const values = {a: 1, b: 2, x: [1, 2]};
			const obs1 = hot('-a|', values);
			const obs2 = hot('--b|', values);
			const expected = cold('---(x|)', values);
			const readFileFn = jasmine.createSpy();

			readFileFn.and.callFake((filenumber: any) => {
				return filenumber === 1 ? obs1 : obs2;
			});
			service.readFile = readFileFn;

			// Act
			const result = service.readFilesAsArray([1, 2] as any);

			// Assert
			expect(result).toBeObservable(expected);
			expect(readFileFn).toHaveBeenCalledTimes(2);
		});
	});

	describe('readFile', () => {
		it('reads the file and returns it when completed', (done: any) => {
			// Arrange
			const readAsTextFn = jasmine.createSpy();
			const expectedResult = 'result';
			const file = {} as any;
			const reader = {
				readAsText: readAsTextFn,
				result: expectedResult
			} as any;

			// Act
			const sub = service.readFile(file, reader);

			// Assert
			sub.subscribe((result) => {
				expect(result.contents).toEqual(expectedResult);
				done();
			});
			reader.onload();
			expect(readAsTextFn).toHaveBeenCalledWith(file);
		});
	});
});
