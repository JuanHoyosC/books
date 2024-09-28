import { Component, inject } from '@angular/core';
import { ConfirmSignUpComponent } from '../components/confirm-sign-up/confirm-sign-up.component';
import { AuthService, emailRegex, User, userRegex } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {


  authService = inject(AuthService);
  modalCtrl = inject(ModalController);
  utilityService = inject(UtilityService);
  router = inject(Router);
  fb = inject(FormBuilder);
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
        this.opengConfirmSignUpComponent();
      }
    } catch (error) {
      this.authService.manageAuthErrors(error);
    }
  }

  async opengConfirmSignUpComponent() {
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
      this.router.navigateByUrl("/attendee/create");
    }
  }

  showSendEmailMessage() {
    // this.conferenceService.showToast({
    //   color: "success",
    //   message: this.translateService.instant('auth.general.sendCodeMessage'),
    //   duration: 10000,
    //   icon: "checkmark-circle-sharp",
    // });
  }

}
