import {NgModule} from '@angular/core';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
	imports: [SharedModule],
	declarations: [FileUploaderComponent],
	exports: [FileUploaderComponent]
})
export class FileModule {}
