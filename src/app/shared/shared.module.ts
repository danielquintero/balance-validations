import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatCardModule,
	MatTableModule,
	MatToolbarModule,
	MatIconModule,
	MatChipsModule,
	MatSnackBarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

export const ANGULAR_SHARED_MODULES = [
	MatSnackBarModule,
	MatChipsModule,
	MatButtonModule,
	MatIconModule,
	MatCardModule,
	MatTableModule,
	MatToolbarModule,
	FlexLayoutModule,
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	HttpClientModule
];

@NgModule({
	imports: [...ANGULAR_SHARED_MODULES],
	declarations: [],
	exports: [...ANGULAR_SHARED_MODULES]
})
export class SharedModule {}
