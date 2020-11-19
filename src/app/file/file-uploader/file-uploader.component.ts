import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ReadFile} from '@rabo/file/file.model';
import {Store, select} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {FileActions} from '@rabo/file/store/actions';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
	selector: 'app-file-uploader',
	templateUrl: './file-uploader.component.html',
	styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit, OnDestroy {
	public files$: Observable<ReadFile[]>;
	public uploadError$: Observable<string>;
	public validationError$: Observable<string>;
	@ViewChild('uploader', {static: true})
	public uploader: ElementRef<HTMLInputElement>;

	private subscriptions: Subscription;

	constructor(private store: Store<fromRoot.State>, private snackBar: MatSnackBar) {}

	public ngOnInit() {
		this.init();
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
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
		this.uploadError$ = this.store.pipe(select(fromRoot.getUploadError));
		this.validationError$ = this.store.pipe(select(fromRoot.getValidationError));
		this.subscriptions.add(
			this.uploadError$.subscribe((err: string) => {
				if (err) {
					this.snackBar.open(err);
				}
			})
		);
		this.subscriptions.add(
			this.validationError$.subscribe((err: string) => {
				if (err) {
					this.snackBar.open(err);
				}
			})
		);
	}
}
