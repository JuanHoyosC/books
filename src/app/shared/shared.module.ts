import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButtonLoadingComponent } from './components/ion-button-loading/ion-button-loading.component';
import { IonicModule } from '@ionic/angular';
import { VerifyInputComponent } from './components/verify-input/verify-input.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [IonButtonLoadingComponent, VerifyInputComponent],
  exports: [IonButtonLoadingComponent, VerifyInputComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class SharedModule { }
