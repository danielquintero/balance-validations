import {ReadFile} from '@rabo/file/file.model';
import {CustomerStatement} from '@rabo/file/statement.model';
import {FileActions} from '@rabo/file/store/actions';

export interface State {
	files: ReadFile[];
	records: CustomerStatement[];
	uploadError: string;
	validationError: string;
}

export const initialState: State = {
	files: [],
	records: [],
	uploadError: null,
	validationError: null
};

export function reducer(state: State = initialState, action: FileActions.FileActionsUnion): State {
	switch (action.type) {
		case FileActions.FileActionTypes.UploadSuccess:
			return {
				...state,
				uploadError: null,
				files: action.payload
			};

		case FileActions.FileActionTypes.UploadFailure:
			return {
				...state,
				uploadError: action.payload
			};

		case FileActions.FileActionTypes.ValidateSuccess:
			return {
				...state,
				validationError: null,
				records: action.payload
			};

		case FileActions.FileActionTypes.ValidateFailure:
			return {
				...state,
				validationError: action.payload
			};

		default:
			return state;
	}
}

export const getFiles = (state: State) => state.files;
export const getUploadError = (state: State) => state.uploadError;
export const getValidationError = (state: State) => state.validationError;
export const getRecords = (state: State) => state.records;
