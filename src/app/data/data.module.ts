import {NgModule} from '@angular/core';
import {SharedModule} from '@rabo/shared/shared.module';
import {DataTableComponent} from './data-table/data-table.component';

@NgModule({
	imports: [SharedModule],
	declarations: [DataTableComponent],
	exports: [DataTableComponent]
})
export class DataModule {}
