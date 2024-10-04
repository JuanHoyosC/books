import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButtonLoadingComponent } from './components/ion-button-loading/ion-button-loading.component';
import { IonicModule } from '@ionic/angular';
import { VerifyInputComponent } from './components/verify-input/verify-input.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [IonButtonLoadingComponent, VerifyInputComponent],
  exports: [IonButtonLoadingComponent, VerifyInputComponent, TranslateModule],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule.forChild(),
  ]
})
export class SharedModule { }
