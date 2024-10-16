import { Component, inject, Input, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent  {
  @Input() borderRadius: string = '8px';
  @Input() height: string = '8px';
  bookService = inject(BookService);

  paginationChanged(page: CustomEvent) { 
    const currentPage = this.bookService.pages.find(p => p.index === page.detail.value);
    if(currentPage) {
      this.bookService.currentPage = currentPage;
      this.bookService.goToChapter(currentPage.location.start.cfi);
    }
  }

}
