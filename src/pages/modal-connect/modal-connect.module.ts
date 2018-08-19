import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalConnectPage } from './modal-connect';

@NgModule({
  declarations: [
    ModalConnectPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalConnectPage),
    TranslateModule.forChild(),
  ],
})
export class ModalConnectPageModule {}
