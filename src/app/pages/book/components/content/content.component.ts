import { Component, inject, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { BookService } from '../../services/book.service';
import { SettingService } from '../../services/setting-book.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-content-book',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  @ViewChild('menuChapters') menuChapters!: IonMenu;
  settingService = inject(SettingService);
  bookService = inject(BookService);
  menuService = inject(MenuService);
  contentOptions: ContentOption[] = [
    {
      label: 'Book details',
      icon: 'information-circle-outline',
      iconColor: 'primary',
      handle: () => {
        this.settingService.settingModal.dismiss();
        this.menuService.open('Book details', 'information');
      },
    },
    {
      label: 'Chapters',
      icon: 'list-outline',
      iconColor: 'primary',
      handle: () => {
        this.settingService.settingModal.dismiss();
        this.menuService.open('Chapters', 'chapters');
      },
    },
    {
      label: 'Books',
      icon: 'library-outline',
      iconColor: 'primary',
      handle: () => {
        this.settingService.settingModal.dismiss();
        this.menuService.open('Bookmarks', 'bookmarks');
      },
    },
    {
      label: 'Bookmarks',
      icon: 'bookmark-outline',
      iconColor: 'warning',
      handle: () => {
        this.settingService.settingModal.dismiss();
        this.menuService.open('Bookmarks', 'bookmarks');
      },
    },
    {
      label: 'Reminders',
      icon: 'alarm-outline',
      iconColor: 'danger',
      handle: () => {
        this.settingService.settingModal.dismiss();
        this.menuService.open('Reminders', 'reminders');
      },
    },
  ];
}

type ContentOption = {
  label: string;
  icon: string;
  iconColor: string;
  handle: () => void;
};
