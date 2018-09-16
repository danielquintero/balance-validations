import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs';
import {FileReaderService} from '@rabo/file/file-reader.service';
import {tap, take, mergeMap} from 'rxjs/operators';
import {ParserService} from '@rabo/file/parser/parser.service';
import {MT940} from '@rabo/file/MT940.model';
import {ReadFile} from '@rabo/file/file.model';

type ReadAsText = string | ArrayBuffer | null;
@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html',
	styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
	@ViewChild('uploader')
	private uploader: ElementRef<HTMLInputElement>;
	private files: ReadFile[];

	constructor(private parserService: ParserService, private fileReaderService: FileReaderService) {}

	public ngOnInit() {
		this.files = [];
	}

	public uploadFiles() {
		let fileSource$: Observable<ReadFile[]>;
		this.uploader.nativeElement.onchange = () => {
			fileSource$ = this.fileReaderService.readFilesAsArray(this.uploader.nativeElement.files);
			fileSource$
				.pipe(
					take(1),
					tap((values) => (this.files = values)),
					tap((values) => console.log('Before parsed', values)),
					mergeMap((files: ReadFile[]) => this.parserService.parse(files)),
					tap((values) => console.log('After parsed', values))
				)
				.subscribe((MT940Complient: MT940[]) => {
					// disptach UPLOAD_FILES with the parsed, validated object files
				});
		};
		this.uploader.nativeElement.click();
	}
}
