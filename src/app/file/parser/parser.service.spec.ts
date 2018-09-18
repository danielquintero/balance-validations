import {ParserService} from '@rabo/file/parser/parser.service';
import {ReadFile} from '@rabo/file/file.model';
import {of} from 'rxjs';
import {Parser} from 'xml2js';

describe('ParserService', () => {
	let service: ParserService;
	let parser: Parser;

	const generateReadFileArray = (type = null, content = 'test'): ReadFile[] => {
		const files = new Array<ReadFile>();
		const data = new Blob([content]);
		const arrayOfBlob = new Array<Blob>();

		arrayOfBlob.push(data);

		const file = new File(arrayOfBlob, `Mock.${type}`, {type: type}) as ReadFile;
		file['contents'] = content;
		files.push(file);

		return Array.from(files);
	};

	beforeEach(() => {
		service = new ParserService();
		parser = new Parser({
			explicitArray: false
		});
	});

	describe('parse', () => {
		it('throws error when there is no type', () => {
			// Arrange
			const arr = [{a: 1}] as any;

			// Assert
			expect(() => service.parse(arr)).toThrowError('Cannot parse file without a type');
		});
		it('calls csvJs with the file contents', () => {
			// Arrange
			const type = 'text/csv';
			const files = generateReadFileArray(type);
			const cvsJsFn = spyOn(service as any, 'csvJs');

			// Act
			service.parse(files);

			// Assert
			expect(cvsJsFn).toHaveBeenCalledWith('test');
		});
		it('calls xml2MT940 with the file contents', () => {
			// Arrange
			const type = 'text/xml';
			const content = '<xml><accountNumber>NL90ABNA0585647886</accountNumber></xml>';
			const files = generateReadFileArray(type, content);
			const cvsJsFn = spyOn(service as any, 'xml2MT940');

			// Act
			service.parse(files);

			// Assert
			expect(cvsJsFn).toHaveBeenCalledWith({xml: Object({accountNumber: 'NL90ABNA0585647886'})});
		});
	});

	describe('xml2MT940', () => {
		it('transforms a parsed xml2js obj into MT940 compliant obj', async () => {
			// Arrange
			const type = 'text/xml';
			const content = `
            <records>
                <record reference="168512">
                    <accountNumber>NL90ABNA0585647886</accountNumber>
                    <description>Flowers from Peter King</description>
                    <startBalance>5429</startBalance>
                    <mutation>-939</mutation>
                    <endBalance>6368</endBalance>
                </record>
                <record reference="168512">
                    <accountNumber>NL90ABNA0585647886</accountNumber>
                    <description>Flowers from Peter King</description>
                    <startBalance>5429</startBalance>
                    <mutation>-939</mutation>
                    <endBalance>6368</endBalance>
                </record>
        </records>`;
			const expected = ['reference', 'accountNumber', 'description', 'startBalance', 'endBalance', 'mutation'];
			const files = generateReadFileArray(type, content);
			parser.parseString(content, (err, result) => {
				const MT940Compliant = service['xml2MT940'](result);
				expect(Object.keys(MT940Compliant[0])).toEqual(expected);
			});
		});
	});
});
