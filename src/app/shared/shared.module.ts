import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
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
