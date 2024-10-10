import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButtonLoadingComponent } from './components/ion-button-loading/ion-button-loading.component';
import { IonicModule } from '@ionic/angular';
import { VerifyInputComponent } from './components/verify-input/verify-input.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputRangeComponent } from './components/input-range/input-range.component';
import { SelectedButtonComponent } from './components/selected-button/selected-button.component';



@NgModule({
  declarations: [IonButtonLoadingComponent, VerifyInputComponent, InputRangeComponent, SelectedButtonComponent],
  exports: [IonButtonLoadingComponent, VerifyInputComponent, InputRangeComponent, SelectedButtonComponent, TranslateModule],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule.forChild(),
  ]
})
export class SharedModule { }
