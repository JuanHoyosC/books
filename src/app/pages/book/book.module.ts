import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedBookModule } from './components/shared-book.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SharedBookModule,
    BookPageRoutingModule,
  ],
  declarations: [BookPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookPageModule {}
