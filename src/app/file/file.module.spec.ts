import {FileModule} from './file.module';

describe('UploadModule', () => {
	let uploadModule: FileModule;

	beforeEach(() => {
		uploadModule = new FileModule();
	});

	it('should create an instance', () => {
		expect(uploadModule).toBeTruthy();
	});
});
