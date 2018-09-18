import {ReadFile} from '@rabo/file/file.model';
import {MT940} from '@rabo/file/statement.model';
import {FileActions} from '@rabo/file/store/actions';

export interface State {
	files: ReadFile[];
	uploadError: string;
	records: MT940[];
}

const initialState: State = {
	files: [],
	uploadError: null,
	records: []
};

export function reducer(state: State = initialState, action: FileActions.FileActionsUnion): State {
	switch (action.type) {
		case FileActions.FileActionTypes.UploadSuccess:
			return {
				...state,
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
				records: action.payload
			};

		case FileActions.FileActionTypes.ValidateFailure:
			return {
				...state
			};

		default:
			return state;
	}
}

export const getFiles = (state: State) => state.files;
export const getUploadError = (state: State) => state.uploadError;
export const getRecords = (state: State) => state.records;
