import {Action} from '@ngrx/store';
import {ReadFile} from '@rabo/file/file.model';
import {MT940, CustomerStatement} from '@rabo/file/statement.model';

export enum FileActionTypes {
	Upload = '[Files] Upload',
	UploadSuccess = '[Files] Upload Success',
	UploadFailure = '[Files] Upload Failure',
	Validate = '[Files] Validate',
	ValidateSuccess = '[File] Validate Success',
	ValidateFailure = '[File] Validate Failure'
}

export class Upload implements Action {
	readonly type = FileActionTypes.Upload;
	constructor(public payload: FileList) {}
}
export class UploadSuccess implements Action {
	readonly type = FileActionTypes.UploadSuccess;
	constructor(public payload: ReadFile[]) {}
}
export class UploadFailure implements Action {
	readonly type = FileActionTypes.UploadFailure;
	constructor(public payload: string) {}
}

export class Validate implements Action {
	readonly type = FileActionTypes.Validate;
	constructor(public payload: MT940[]) {}
}
export class ValidateSuccess implements Action {
	readonly type = FileActionTypes.ValidateSuccess;
	constructor(public payload: CustomerStatement[]) {}
}
export class ValidateFailure implements Action {
	readonly type = FileActionTypes.ValidateFailure;
	constructor(public payload: string) {}
}

export type FileActionsUnion = Upload | UploadSuccess | UploadFailure | Validate | ValidateSuccess | ValidateFailure;
