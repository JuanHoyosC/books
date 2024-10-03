import { Component, inject, Input } from '@angular/core';
import { AuthService, userRegex } from '../../services/auth.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SharedModule],
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  @Input() username: string = '';
  authService = inject(AuthService);
  modalCtrl = inject(ModalController);
  utilityService = inject(UtilityService);
  fb = inject(FormBuilder);
  form: FormGroup;
  loading: boolean = false;
  positions: number = 6;
  step: 'SEND_CODE' | 'RESET_PASSWORD' = 'SEND_CODE';
  timer: number = 30;
  constructor() {
    this.form = this.getForm();
  }

  getForm(): FormGroup {
    return this.fb.group(
      {
        username: ['', [Validators.required, Validators.pattern(userRegex)]],
        code: [
          '',
          [
            Validators.required,
            this.utilityService.digitValidator(this.positions),
          ],
        ],
        password: [
          '',
          [Validators.required, Validators.min(6)],
          this.utilityService.whitespaceValidator(),
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.min(6),
            this.utilityService.whitespaceValidator(),
          ],
        ],
      },
      {
        validators: this.utilityService.matchFieldsValidator(
          'password',
          'repeatPassword'
        ),
      }
    );
  }

  async submit() {
    this.loading = true;
    if (this.step === 'SEND_CODE') {
      await this.resetPassword();
    } else if (this.step === 'RESET_PASSWORD') {
      await this.confirmResetPassword();
    }
    this.loading = false;
  }

  async resetPassword() {
    try {
      const { nextStep } = await this.authService.resetPassword(
        this.form.value.username
      );
      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        this.step = 'RESET_PASSWORD';
        this.initResendCodeTimer();
        //this.showSendEmailMessage();
      }
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  async confirmResetPassword() {
    try {
      const { username, password, code } = this.form.value;
      await this.authService.confirmResetPassword(username, password, code);
      this.modalCtrl.dismiss();
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  async resendCode() {
    await this.resetPassword();
    this.initResendCodeTimer();
  }

  initResendCodeTimer() {
    this.timer = 30;
    const interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) clearInterval(interval);
    }, 1000);
  }
}
