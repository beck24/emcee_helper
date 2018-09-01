import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerPage } from './timer';
import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [
    TimerPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerPage),
    ComponentsModule,
  ],
})
export class TimerPageModule {}
