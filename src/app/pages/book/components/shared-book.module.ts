import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContentComponent } from './content/content.component';
import { MenuBookComponent } from './menu/menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookChaptersComponent } from './book-chapters/book-chapters.component';
import { BookMarksComponent } from './book-marks/book-marks.component';
import { SearchComponent } from './search/search.component';
import { RemindersComponent } from './reminders/reminders.component';
import { DetailComponent } from './detail/detail.component';
import { MarkTextPipe } from '../pipes/mark-text.pipe';
import { NoteComponent } from './note/note.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule],
  declarations: [
    MenuBookComponent,
    SettingsComponent,
    ContentComponent,
    BookChaptersComponent,
    BookMarksComponent,
    SearchComponent,
    RemindersComponent,
    DetailComponent,
    NoteComponent,
    ProgressComponent,
    MarkTextPipe,
  ],
  exports: [
    MenuBookComponent,
    BookChaptersComponent,
    BookMarksComponent,
    SearchComponent,
    RemindersComponent,
    DetailComponent,
    NoteComponent,
    ProgressComponent,
    MarkTextPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedBookModule {}
