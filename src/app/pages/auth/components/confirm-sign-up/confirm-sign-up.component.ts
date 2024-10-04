import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ConfirmSignUpOutput } from 'aws-amplify/auth';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-sign-up',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SharedModule],
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.scss'],
})
export class ConfirmSignUpComponent {
  @Input() username: string = '';
  translateService = inject(TranslateService);
  utilityService = inject(UtilityService);
  modalCtrl = inject(ModalController);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  form: FormGroup;
  loading: boolean = false;
  positions: number = 6;
  constructor() {
    this.form = this.getForm();
  }

  getForm(): FormGroup {
    return this.fb.group({
      code: [
        '',
        [Validators.required, this.utilityService.digitValidator(this.positions)],
      ],
    });
  }

  async submit() {
    if (this.form.valid) {
      this.loading = true;
      await this.confirmSignUp();
      this.loading = false;
    }
  }

  async confirmSignUp() {
    try {
      const response: ConfirmSignUpOutput =
        await this.authService.confirmSignUp({
          username: this.username,
          confirmationCode: this.form.value.code,
        });

      this.modalCtrl.dismiss(null);
      this.showMessageSignUpSuccess();
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  showMessageSignUpSuccess() {
    this.utilityService.showToast({
      color: "success",
      message: this.translateService.instant('auth.general.signupSuccessMessage'),
      duration: 10000,
      icon: "checkmark-circle-sharp",
    });
  }
}
