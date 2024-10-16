import { Injectable } from '@angular/core';
import { IonMenu } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu!: IonMenu;
  title: string = '';
  content: Content = undefined

  constructor() { }

  setMenu(menu: IonMenu) { 
    this.menu = menu;
  }

  getMenu(): IonMenu {
    return this.menu;
  }

  open(title: string, content: Content) {
    this.title = title;
    this.content = content;
    this.menu.open(true);
  } 

  close() {
    this.menu.close();
  }
}


type Content = 'chapters' | 'bookmarks' | 'search' | 'reminders' | 'information' | undefined;