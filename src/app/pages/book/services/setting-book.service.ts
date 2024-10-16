import { Injectable } from '@angular/core';
import {
  OrientationLockType,
  ScreenOrientation,
  ScreenOrientationResult,
} from '@capacitor/screen-orientation';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { IonModal, IonToast } from '@ionic/angular';
import { Rendition } from 'epubjs';
@Injectable({
  providedIn: 'root',
})
export class SettingService {
  settingModal!: IonModal; // Modal que contiene el contenido y las configuraciones
  noteModal!: IonModal; // Modal que contiene las notas de palabras dentro del libro
  toast!: IonToast;
  setting: Setting = {
    brightness: 0.5,
    font: 'Nunito',
    fontSize: 12,
    lineHeight: 12,
    margin: 10,
    orientation: 'portrait',
    theme: {
      name: 'dark',
      background: '#121212',
      borderColor: '',
      color: '#fff',
    },
    hyphen: false,
  };

  constructor() {}

   //=============== Modal note view =============================

   setNoteModal(modal: IonModal) {
    this.noteModal = modal;
  }

  getNoteModal(): IonModal {
    return this.noteModal;
  }

  //=============== Modal Setting view =============================

  setSettingModal(modal: IonModal) {
    this.settingModal = modal;
  }

  getSettingModal(): IonModal {
    return this.settingModal;
  }

  updateModalSettingView(orientation: OrientationLockType) {
    this.setPhoneOrientation(orientation);
    const modalElement = this.settingModal.presentingElement
    if (!modalElement) return;
    modalElement.classList.remove('right');
    if (orientation === 'landscape' || orientation === 'landscape-primary') {
      modalElement.style.setProperty('--height', '100%');
      modalElement.style.setProperty('--width', '405px');
      modalElement.classList.add('right');
    }

    if (orientation === 'portrait' || orientation === 'portrait-primary') {
      modalElement.style.setProperty('--height', '405px');
    }
  }

  //=============== Toast view =============================

  setToast(toast: IonToast) {
    this.toast = toast;
  }

  getToast(): IonToast {
    return this.toast;
  }

  //=============== Theme =============================

  setTheme(theme: Theme) {
    this.setting.theme = theme;
  }

  getTheme(theme: Theme) {
    this.setting.theme = theme;
  }

  //=============== Font =============================

  setFont(font: Font) {
    this.setting.font = font;
  }

  //=============== Font size =============================

  setFontSize(fontSize: number) {
    this.setting.fontSize = fontSize;
  }

  //=============== Line heigth =============================

  setLineHeight(lineHeight: number) { 
    this.setting.lineHeight = lineHeight;
  }

  //=============== Margin =============================
  setMargin(margin: number) { 
    this.setting.margin = margin;
  }

  setHyphen() {
    this.setting.hyphen = !this.setting.hyphen;
  }

  //====================================== Brightness =============================

  async getBrightness(): Promise<number> {
    const brightness = await ScreenBrightness.getBrightness();
    return brightness.brightness;
  }

  async setBrightness(brightness: number): Promise<void> {
    this.setting.brightness = brightness;
    await ScreenBrightness.setBrightness({ brightness });
    this.presentBrightnessToast(brightness);
  }

  timeout: number = 0;
  async presentBrightnessToast(value: number) {
    if (!this.toast) return;
    this.toast.message = `${Math.ceil(value * 100)}%`;
    this.toast.icon = 'sunny-sharp';
    await this.toast.present();
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.toast.dismiss();
    }, 1000) as unknown as number; // Garantizamos que el resultado sea tratado como número
  }

  //====================================== Orientation =============================

  async getPhoneOrientation(): Promise<ScreenOrientationResult> {
    return ScreenOrientation.orientation();
  }

  async setPhoneOrientation(orientation: OrientationLockType) {
    this.setting.orientation = orientation;
    await ScreenOrientation.lock({ orientation: orientation });
    this.updateModalSettingView(orientation);
  }
}

type Setting = {
  brightness: number;
  fontSize: number;
  lineHeight: number;
  margin: number;
  orientation: OrientationLockType;
  theme: Theme;
  font: Font;
  hyphen: boolean;
};

type HEXADECIMAL = `#${string}`;
export type Theme = {
  name: string;
  background: HEXADECIMAL | string;
  color: HEXADECIMAL | string;
  borderColor: HEXADECIMAL | string
};

export type Font = 'Arial' | 'Times New Roman' | 'Nunito';

export type OrientationOptions = {
  label: string;
  icon: string;
  value: OrientationLockType;
};
