import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {FileModule} from './file/file.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		// module exposes shared modules
		SharedModule,

		// App modules
		FileModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
