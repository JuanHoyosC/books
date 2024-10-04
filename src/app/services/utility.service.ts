import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastButton, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  toastController = inject(ToastController);
  translateService = inject(TranslateService);
  toast?: HTMLIonToastElement;
  constructor() { }

  whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      // Comprobar si el valor del campo está vacío o solo contiene espacios en blanco
      if (control.value && control.value.trim().length === 0) {
        return { invalid: true };
      }
      return null;
    };
  }

  digitValidator(position: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      // Comprobar si el valor del campo está vacío o solo contiene espacios en blanco
      if (control.value && control.value.toString().trim().length !== position) {
        return { invalid: true };
      }
      return null;
    };
  }

  matchFieldsValidator(
    controlName1: string,
    controlName2: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const control1 = formGroup.get(controlName1);
      const control2 = formGroup.get(controlName2);

      if (!control1 || !control2) {
        return null;
      }

      if (control1.value !== control2.value) {
        return { mismatch: true };
      }
      return null;
    };
  }

  /**
   * Normalizes the text to ignore accents and special characters.
   * @param text - The text to be normalized.
   * @returns The normalized text without accents and in lowercase.
   */
  removeDiacritics(text: string): string {
    if (!text) return "";
    return text
      .normalize("NFD") // Decomposes accented characters into base characters and diacritics
      .replace(/[\u0300-\u036f]/g, "") // Removes diacritic characters
      .toLowerCase(); // Converts to lowercase
  }

  async showToast(toast: Toast) {
    toast.duration = toast.duration ?? 10000;
    this.toast && this.toast.dismiss();
    const buttons = toast?.buttons ?? [];
    this.toast = await this.toastController.create({
      message: toast.message,
      duration: toast.duration,
      header: toast?.header,
      position: "top",
      color: toast.color,
      icon: toast.icon,
      swipeGesture: "vertical",
      mode: 'ios',
      buttons: [
        ...buttons,
        {
          role: "cancel",
          icon: "close-sharp",
        },
      ],
    });
    await this.toast.present();
  }
}

export interface Toast {
  message: string;
  header?: string;
  color: string;
  icon: string;
  duration: number;
  buttons?: ToastButton[] | undefined
}