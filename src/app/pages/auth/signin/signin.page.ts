import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService, User, userRegex } from '../services/auth.service';
import { Router } from '@angular/router';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ConfirmSignUpComponent } from '../components/confirm-sign-up/confirm-sign-up.component';
import { UtilityService } from 'src/app/services/utility.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {

  translateService = inject(TranslateService)
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
      await this.signIn(this.form.value);
      this.loading = false;
    }
  }

  async signIn(user: User) {
    try {
      const { nextStep } = await this.authService.signIn(user);
      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        this.opengConfirmSignUpComponent();
      }

      if (nextStep.signInStep === "DONE") {
        this.goToHomePage();
      }
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  async signInWithGoogle() {
    this.authService.signInWithGoogle().then((response) => {
      console.log(response);
    })
  }

  async opengConfirmSignUpComponent() {
    this.showSendEmailMessage();
    const modal = await this.modalCtrl.create({
      component: ConfirmSignUpComponent,
      componentProps: {
        username: this.form.value.username,
      },
      cssClass: "full-screen-modal",
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.signUpStep === "DONE") {
      this.goToHomePage();
    }
  }

  async openResetPasswordComponent() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
      componentProps: {
        username: this.form.value.username,
      },
      cssClass: "full-screen-modal",
    });

    await modal.present();
  }

  goToHomePage() {
    this.router.navigateByUrl("/tabs/home");
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
