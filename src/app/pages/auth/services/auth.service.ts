import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  confirmSignUp,
  signIn,
  signUp,
  resetPassword,
  confirmResetPassword,
  signOut,
  signInWithRedirect,
  ConfirmSignUpOutput,
  ResetPasswordOutput,
  SignUpOutput,
  SignInOutput
} from "aws-amplify/auth";
import { UtilityService } from "src/app/services/utility.service";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  translateService = inject(TranslateService);
  utilityService = inject(UtilityService);
  userId: string = "";
  constructor() {}

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }

  async signIn(user: User): Promise<SignInOutput> {
    return signIn({
      username: user.username,
      password: user.password,
    });
  }

  async signUp(user: User): Promise<SignUpOutput> {
    return signUp({
      username: user.username,
      password: user.password,
      options: {
        userAttributes: {
          preferred_username: user.username,
          email: user.email,
        },
      },
    });
  }

  async signInWithGoogle(): Promise<void> {
    return signInWithRedirect({ provider: "Google" })
  }

  async confirmSignUp(user: UserConfirmSignUp): Promise<ConfirmSignUpOutput> {
    return confirmSignUp(user);
  }

  async resetPassword(username: string): Promise<ResetPasswordOutput> {
    return resetPassword({ username });
  }

  async confirmResetPassword(
    username: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<void> {
    return confirmResetPassword({ username, newPassword, confirmationCode });
  }

  async manageAuthErrors(error: any) {
    let message = this.translateService.instant(
      `auth.cognito.${error.message}`
    );

    await this.presentToast(message);
  }

  async presentToast(message: string) {
    this.utilityService.showToast({
      message,
      color: "danger",
      duration: 10000,
      icon: "alert-circle-sharp",
    });
  }


  async signOut() {
    await signOut();
  }
}

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UserConfirmSignUp {
  username: string;
  confirmationCode: string;
}

export const emailRegex =
  /^([a-zA-Z0-9_.-]+)(\+[0-9]+)?@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
export const userRegex = /^([a-zA-Z0-9_.:-]){1,50}$/;