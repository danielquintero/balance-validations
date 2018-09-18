import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FileReaderService} from '@rabo/file/reader/file-reader.service';
import {tap, take, mergeMap} from 'rxjs/operators';
import {ParserService} from '@rabo/file/parser/parser.service';
import {MT940} from '@rabo/file/statement.model';
import {ReadFile} from '@rabo/file/file.model';
import {Store, select} from '@ngrx/store';
import * as fromFile from '@rabo/file/store/reducers/file.reducer';
import * as fromRoot from '../../reducers';
import {FileActions} from '@rabo/file/store/actions';
import {MatSnackBar} from '@angular/material';

type ReadAsText = string | ArrayBuffer | null;
@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html',
	styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
	public files$: Observable<ReadFile[]>;
	public error$: Observable<string>;
	@ViewChild('uploader')
	public uploader: ElementRef<HTMLInputElement>;

	private subscriptions: Subscription;

	constructor(private store: Store<fromRoot.State>, private snackBar: MatSnackBar) {}

	public ngOnInit() {
		this.init();
		this.subscriptions.add(
			this.error$.subscribe((err: string) => {
				if (err) {
					this.snackBar.open(err);
				}
			})
		);
	}

	public uploadFiles() {
		this.uploader.nativeElement.onchange = () => {
			const {files} = this.uploader.nativeElement;
			this.store.dispatch(new FileActions.Upload(files));
		};
		this.uploader.nativeElement.click();
	}

	private init() {
		this.subscriptions = new Subscription();
		this.files$ = this.store.pipe(select(fromRoot.getFiles));
		this.error$ = this.store.pipe(select(fromRoot.getUploadError));
	}
}
