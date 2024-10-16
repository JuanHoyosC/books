import { Component, inject, OnInit } from '@angular/core';
import { BookService, CustomLocation } from '../../services/book.service';
import { Location } from 'epubjs';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-book-marks',
  templateUrl: './book-marks.component.html',
  styleUrls: ['./book-marks.component.scss'],
})
export class BookMarksComponent  {
  private menuService = inject(MenuService);
  bookService = inject(BookService);


  goToPage(cfi: string) {
    this.bookService.goToChapter(cfi);
    this.menuService.close();
  }

}
