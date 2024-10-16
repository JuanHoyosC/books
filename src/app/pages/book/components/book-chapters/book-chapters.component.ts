import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { NavItem } from 'epubjs';
import { BookService } from '../../services/book.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-book-chapters',
  templateUrl: './book-chapters.component.html',
  styleUrls: ['./book-chapters.component.scss'],
})
export class BookChaptersComponent  implements OnChanges {
  @Input() chapters: NavItem[] = [];
  bookService = inject(BookService);
  menuService = inject(MenuService);
  items: { active: boolean }[] = [];

  constructor() { }

  ngOnChanges() {
    this.chapters.forEach((chapter: NavItem) => {
      this.items.push({ active: chapter.subitems?.length !== 0});
    })
  }


  async goToChapter(href: string) { 
    await this.bookService.goToChapter(href);
    this.menuService.close();
  }

}
