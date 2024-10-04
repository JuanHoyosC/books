import { Component, inject } from '@angular/core';
import { ConfirmSignUpComponent } from '../components/confirm-sign-up/confirm-sign-up.component';
import { AuthService, emailRegex, User, userRegex } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  translateService = inject(TranslateService);
  utilityService = inject(UtilityService);
  modalCtrl = inject(ModalController);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  form: FormGroup;
  loading: boolean = false;
  constructor() {
    this.form = this.getForm();
  }

  getForm(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required, Validators.pattern(userRegex)]],
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          this.utilityService.whitespaceValidator(),
        ],
      ],
    });
  }

  async submit() {
    if (this.form.valid) {
      this.loading = true;
      await this.signUp(this.form.value);
      this.loading = false;
    }
  }

  async signUp(user: User) {
    try {
      const { nextStep } = await this.authService.signUp(user);
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        this.openConfirmSignUpComponent();
      }
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  async openConfirmSignUpComponent() {
    this.showSendEmailMessage();
    const modal = await this.modalCtrl.create({
      component: ConfirmSignUpComponent,
      componentProps: {
        username: this.form.value.username,
      },
      cssClass: 'full-screen-modal'
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.signUpStep === "DONE") {
      this.router.navigateByUrl("/tabs/home");
    }
  }

  showSendEmailMessage() {
    this.utilityService.showToast({
      color: "success",
      message: this.translateService.instant('auth.general.sendCodeMessage'),
      duration: 10000,
      icon: "checkmark-circle-sharp",
    });
  }

}
