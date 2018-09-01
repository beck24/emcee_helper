import { NgModule } from '@angular/core';
import { TimerComponent } from './timer/timer';
import { CountdownComponent } from './countdown/countdown';
@NgModule({
	declarations: [TimerComponent,
    CountdownComponent],
	imports: [],
	exports: [TimerComponent,
    CountdownComponent]
})
export class ComponentsModule {}
