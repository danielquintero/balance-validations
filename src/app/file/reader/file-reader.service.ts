import {Observable, Observer, forkJoin, from} from 'rxjs';
import {ReadFile} from '@rabo/file/file.model';
import {mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

/**
 * @module UploadModule
 *
 * @ngdoc service
 *
 * @name FileReaderService
 */
@Injectable({
	providedIn: 'root'
})
export class FileReaderService {
	public readFilesInParallel(files: File[]): Observable<ReadFile> {
		return from(files).pipe(mergeMap((file: File) => this.readFile(file, new FileReader())));
	}

	public readFilesAsArray(files: FileList): Observable<ReadFile[]> {
		const filesArray: File[] = [];
		for (let i = 0; i < files.length; i++) {
			filesArray.push(files.item(i));
		}
		return forkJoin(filesArray.map((file: File) => this.readFile(file, new FileReader())));
	}

	public readFile(file: File, reader: FileReader): Observable<ReadFile> {
		return Observable.create((observer: Observer<ReadFile>) => {
			reader.onload = () => {
				const readFile = file as ReadFile;
				readFile.contents = reader.result as string;
				observer.next(readFile);
				observer.complete();
			};

			reader.onerror = () => {
				observer.error('Failed uploading file');
				observer.complete();
			};

			reader.readAsText(file);
		});
	}
}
