import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonMenu, IonModal, IonToast, ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { MenuBookComponent } from './components/menu/menu.component';
import { SettingService } from './services/setting-book.service';
import { BookService } from './services/book.service';
import { MenuService } from './services/menu.service';
@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit, AfterViewInit {
  @ViewChild('settingModal') modal!: IonModal;
  @ViewChild('noteModal') noteModal!: IonModal;
  @ViewChild('menu') menu!: IonMenu;
  @ViewChild('ionToast') toast!: IonToast;
  modalCtrl = inject(ModalController);
  settingService = inject(SettingService);
  bookService = inject(BookService);
  menuService = inject(MenuService);

  constructor() {
    register();
  }

  async ngOnInit() {
    //await ScreenOrientation.lock({ orientation: "portrait" });
    this.bookService.readBook();
  }

  ngAfterViewInit(): void {
    this.menuService.setMenu(this.menu);
    this.settingService.setToast(this.toast);
    this.settingService.setSettingModal(this.modal);
    this.bookService.setSettingModal(this.modal);
    this.bookService.setNoteModal(this.noteModal);
  }


  openSettingModal() {
    this.bookService.openSettingModal();
  }

  async next() {
    await this.bookService.next();
  }

  prev() {
    this.bookService.rendition.prev();
  }

  closeMenu() {
    this.menuService.close();
  }
}
