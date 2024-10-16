import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonModal,
  IonSearchbar,
  SearchbarInputEventDetail,
} from '@ionic/angular';
import {
  InfiniteScrollCustomEvent,
  IonSearchbarCustomEvent,
} from '@ionic/core';
import { BookService, SearchItem } from '../../services/book.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('search') search!: IonSearchbar;
  @ViewChild('modal') modal!: IonModal;
  private bookService = inject(BookService);
  private menuService = inject(MenuService);
  searchValue: string = '';
  index: number = -1;
  step: number = 0;
  total: number = 20;

  items: SearchItem[] = [];
  allItems: SearchItem[] = [];

  constructor() {
    this.bookService.settingModal?.didDismiss.subscribe(() => {
      this.bookService.isCurrentSelectedActive = false;
    })
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      this.search.setFocus();
      const searchElement = await this.search.getInputElement();
      searchElement.focus();
    }, 700);
  }

  async handleInput(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.index = 0;
    this.allItems = [];
    this.items = [];
    this.step = 0;
    if (!event) return;
    const query = event.target.value ?? '';
    if (!query) return;
    const elements = await this.bookService.search(query);
    this.allItems = elements;
    this.generateItems();
  }

  generateItems() {
    const items = this.allItems.slice(
      this.step * this.total,
      this.total * (this.step + 1)
    );
    this.items.push(...items);
    this.step++;
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      ev.target.complete();
    }, 500);
  }

  async goToMark(initialIndex: number) {
    this.index = initialIndex; //Se hace la pagina inicial
    await this.goToPage();
    this.menuService.menu.close();
    this.modal.present();
  }

  async pagination(step: number) {
    if (step === -1 && this.index > 0) {
      this.index -= 1;
      await this.goToPage();
    } else if (step === 1 && this.index < this.allItems.length - 1) {
      this.index += 1;
      await this.goToPage();
    }
  }

  async goToPage() {
    this.bookService.isCurrentSelectedActive = true;
    const item = this.allItems[this.index];
    if (item) {
      await this.bookService.goToChapter(item.cfi);
      this.bookService.markAndHighlightSearchText(item.cfi);
    }
  }
  openSearchMenu() {
    this.modal.dismiss();
    this.menuService.open('Search', 'search');
  }

  openNoteModal(cfi: string) {
    this.bookService.openNoteComponent(cfi);
  }
}
