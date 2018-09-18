import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {FileReaderService} from '@rabo/file/reader/file-reader.service';
import {ParserService} from '@rabo/file/parser/parser.service';
import {FileActions} from '@rabo/file/store/actions';
import {map, mergeMap, switchMap, tap, catchError} from 'rxjs/operators';
import {of, from} from 'rxjs';
import {ReadFile} from '@rabo/file/file.model';
import {MT940} from '@rabo/file/statement.model';
import {StatementValidatorService} from '@rabo/file/validator/validator.service';

@Injectable()
export class FileEffects {
	@Effect()
	upload$ = this.actions$.pipe(
		ofType<FileActions.Upload>(FileActions.FileActionTypes.Upload),
		map((action) => action.payload),
		mergeMap((files: FileList) =>
			this.fileReaderService.readFilesAsArray(files).pipe(
				tap((results) => console.log('read files: ', results)),
				mergeMap((results: ReadFile[]) =>
					this.parserService.parse(results).pipe(
						tap((records) => console.log('parsed: ', records)),
						mergeMap((records: MT940[]) =>
							from([new FileActions.UploadSuccess(results), new FileActions.Validate(records)])
						)
					)
				),
				catchError((err) =>
					of(new FileActions.UploadFailure('There was an error while reading the supplied files'))
				)
			)
		)
	);
	@Effect()
	validate$ = this.actions$.pipe(
		ofType<FileActions.Validate>(FileActions.FileActionTypes.Validate),
		map((action) => action.payload),
		mergeMap((records: MT940[]) =>
			this.statementValidatorService.validate(records).pipe(
				tap((results) => console.log('validated records result: ', results)),
				mergeMap((results) => of(new FileActions.ValidateSuccess(results))),
				catchError((err) =>
					of(new FileActions.ValidateFailure('There was an error while validating the supplied records'))
				)
			)
		)
	);

	constructor(
		private actions$: Actions,
		private parserService: ParserService,
		private statementValidatorService: StatementValidatorService,
		private fileReaderService: FileReaderService
	) {}
}
