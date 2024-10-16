import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, IonModal } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { Font, OrientationOptions, SettingService, Theme } from '../../services/setting-book.service';
import { OrientationLockType } from '@capacitor/screen-orientation';
import { BookService } from '../../services/book.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;
  @ViewChild('moreSettingsModal', { static: true })
  moreSettingsModal!: IonModal;

  //Services
  settingService = inject(SettingService);
  bookService = inject(BookService);

  //Variables
  currentBreakpoint: number = 1;
  isMoreSettingsOpen: boolean = false;
  moreSettingSelected: 'orientation' | 'page' = 'orientation';
  brightness: number = 0;
  orientationOptions: OrientationOptions[] = [
    {
      label: 'Auto rotate',
      icon: 'refresh-outline',
      value: 'natural',
    },
    {
      label: 'Portrait',
      icon: 'phone-portrait-outline',
      value: 'portrait',
    },
    {
      label: 'Landscape',
      icon: 'phone-landscape-outline',
      value: 'landscape',
    },
  ];
  themes: Theme[] = [
    {
      name: 'light',
      background: '#fff',
      color: '#121212',
      borderColor: '#1212122e',
    },
    {
      name: 'yellow',
      background: '#f5deb3',
      color: '#121212',
      borderColor: '#f5deb3',
    },
    {
      name: 'gray',
      background: '#ccc',
      color: '#121212',
      borderColor: '#ccc',
    },
    {
      name: 'dark',
      background: '#121212',
      color: '#fff',
      borderColor: '#232323',
    },
  ];

  size: number = 12;

  fonts: string[] = ['Arial', 'Times New Roman', 'Nunito'];

  constructor() {
    register();
  }

  async ngOnInit() {
    for(let theme of this.themes) {
      this.bookService.rendition.themes.register(theme.name, {
        body: {
          'background-color': theme.background,
          color: theme.color,
        },
      });
    }
  }

  onAccordionChange(e: CustomEvent) {
    this.isMoreSettingsOpen = e.detail.value !== undefined ? true : false;
  }

  openMoreSettingsModal(value: 'orientation' | 'page') {
    this.moreSettingSelected = value;
    this.moreSettingsModal.present();
  }

  closeMoreSettingsModal() {
    this.moreSettingsModal.dismiss();
  }

  setTheme(theme: Theme) {
    this.settingService.setTheme(theme);
    this.bookService.setTheme(theme);
  }

  async setOrientation(orientation: OrientationLockType) {
    this.settingService.setPhoneOrientation(orientation);
  }

  async setBrightness(brightness: any) {
    this.settingService.setBrightness(brightness);
  }

  setFont(font: Font) { 
    this.settingService.setFont(font);
    this.bookService.setFont(font);
  }

  setFontSize(fontSize: number) {
    this.settingService.setFontSize(fontSize);
    this.bookService.setFontSize(fontSize);
  }

  setLineHeight(lineHeight: number) {
    this.settingService.setLineHeight(lineHeight);
    this.bookService.setlineHeight(lineHeight);
  }

  setMargin(margin: number) { 
    this.settingService.setMargin(margin);
    this.bookService.setMargin(margin);
  }

  setHyphen() {
    this.settingService.setHyphen();
    const hyphen = this.settingService.setting.hyphen ? 'auto' : 'none';
    this.bookService.setHyphen(hyphen);
  }

  onFontChange($event: any) {
    console.log($event);
  }
}
