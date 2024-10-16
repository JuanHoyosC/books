import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent  implements OnInit {
  bookImage: string = '';
  bookService = inject(BookService);

  constructor() { }

  ngOnInit() {
    this.getPortada()
  }

  async getPortada() {
    this.bookImage = await this.bookService.getBookPicture();
  }

}
