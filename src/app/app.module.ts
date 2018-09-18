import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {FileModule} from './file/file.module';
import {DataModule} from './data/data.module';
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './reducers';
import {environment} from '../environments/environment';
import {FileEffects} from '@rabo/file/store/effects/file.effect';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		// NgRx
		StoreModule.forRoot(reducers, {metaReducers}),
		EffectsModule.forRoot([FileEffects]),
		StoreDevtoolsModule.instrument({
			name: 'Rabo Customer Statement Processor',
			logOnly: environment.production
		}),

		// module exposes shared modules
		SharedModule,

		// App modules
		FileModule,
		DataModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
