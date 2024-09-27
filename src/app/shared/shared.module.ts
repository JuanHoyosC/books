import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButtonLoadingComponent } from './components/ion-button-loading/ion-button-loading.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [IonButtonLoadingComponent],
  exports: [IonButtonLoadingComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
