import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalLogPage } from './modal-log';

@NgModule({
  declarations: [
    ModalLogPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLogPage),
    TranslateModule.forChild(),
  ],
})
export class ModalLogPageModule {}
