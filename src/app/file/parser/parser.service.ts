import {Injectable} from '@angular/core';
import {Parser} from 'xml2js';
import {ReadFile} from '@rabo/file/file.model';
import {Observable, of} from 'rxjs';
import {MT940} from '@rabo/file/statement.model';

@Injectable({
	providedIn: 'root'
})
export class ParserService {
	constructor() {}
	public parse(files: ReadFile[]): Observable<MT940[]> {
		const parsed: MT940[] = [];
		for (let i = 0; i < files.length; i++) {
			const {contents, type} = files[i];

			if (!type) {
				throw new Error('Cannot parse file without a type');
			}

			if (type.indexOf('csv') >= 0) {
				parsed.push(...this.csvJs(contents));
			}

			if (type.indexOf('xml') >= 0) {
				// it's recommended to create a parser per File
				const parser = new Parser({
					explicitArray: false
				});

				parser.parseString(contents, (err, result) => {
					if (err) {
						throw err;
					}
					parsed.push(...this.xml2MT940(result));
				});
			}
		}
		return of(parsed);
	}

	private xml2MT940(result): MT940[] {
		const {record}: {record: any[]} = result.records;
		const arr: MT940[] = [];
		for (let j = 0; j < record.length; j++) {
			arr.push({
				reference: record[j].$.reference,
				accountNumber: record[j].accountNumber,
				description: record[j].description,
				startBalance: parseFloat(record[j].startBalance),
				endBalance: parseFloat(record[j].endBalance),
				mutation: parseFloat(record[j].mutation)
			});
		}
		return arr;
	}

	private csvJs(csvText: string) {
		const lines = csvText.split('\n');
		const result: MT940[] = [];
		const headers = lines[0].split(',');
		headers.forEach((header: string, index: number, iteratee: string[]) => {
			iteratee[index] = this.camelize(header);
		});

		for (let i = 1; i < lines.length - 1; i++) {
			const obj = {} as MT940;
			const currentline = lines[i].split(',');
			const numerics = ['startBalance', 'endBalance', 'mutation'];

			for (let j = 0; j < headers.length; j++) {
				if (numerics.includes(headers[j])) {
					obj[headers[j]] = parseFloat(currentline[j]);
				} else {
					obj[headers[j]] = currentline[j];
				}
			}
			result.push(obj);
		}

		return result;
	}

	private camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
			if (+match === 0) {
				return '';
			}
			return index === 0 ? match.toLowerCase() : match.toUpperCase();
		});
	}
}
