import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';

import * as fromFile from '@rabo/file/store/reducers/file.reducer';

export interface State {
	file: fromFile.State;
}

export const reducers: ActionReducerMap<State> = {
	file: fromFile.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const getFileState = createFeatureSelector<State, fromFile.State>('file');
export const getFiles = createSelector(getFileState, fromFile.getFiles);
export const getRecords = createSelector(getFileState, fromFile.getRecords);
export const getUploadError = createSelector(getFileState, fromFile.getUploadError);
export const getValidationError = createSelector(getFileState, fromFile.getValidationError);
