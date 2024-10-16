import { Component, inject, Input, OnChanges } from '@angular/core';
import { Annotation, BookService } from '../../services/book.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { IonModal, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnChanges {
  private toastController = inject(ToastController);
  public bookService = inject(BookService);
  @Input() annotationSelected: Annotation | undefined = undefined;
  annotation!: Annotation;

  $modalSubscription!: Subscription;
  showInputNote: boolean = false;
  noteModal!: IonModal;
  isEdition: boolean = false;
  isNoteSave: boolean = false;

  constructor() {
    this.setNoteModal();
  }

  ngOnChanges() {
    if (!this.annotationSelected) return;
    this.annotation = structuredClone(this.annotationSelected);
    this.setEdition();
    this.markText(); //Si es primera vez se marca el texto con el color por defecto
  }

  setEdition() {
    const annotiationFound = this.bookService.getAnnotationByCfi(
      this.annotation.cfi
    );
    this.isEdition = Boolean(annotiationFound);
  }

  setNoteModal() {
    const noteModal = this.bookService.getNoteModal();
    if (!noteModal) return;
    this.noteModal = noteModal;
    this.onDidDismiss();
  }

  onDidDismiss() {
    this.noteModal.didDismiss.subscribe(
      () => {
        if (!this.isNoteSave) {
          this.restorePreviousAnnotationState(); //Si no se guardo restaura todo al estado anterior
        }
        this.bookService.isCurrentSelectedActive = false;
        this.bookService.currentAnnotation = undefined;
      }
    );
  }


  async copyText() {
    await Clipboard.write({ string: this.annotation?.content });
    await this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Texto copiado al portapapeles!',
      icon: 'checkmark-circle-sharp',
      duration: 1500,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  async share() {
    await Share.share({
      text: this.annotation?.content,
      title: this.bookService.metadata.title,
    });
    this.closeNoteModal();
  }

  setColor(color: string) {
    this.annotation.color = color;
    this.markText();
  }

  saveNote() {
    this.isNoteSave = true;
    if (this.isEdition) this.updateAnnotation();
    if (!this.isEdition) this.saveNewAnnotation();
    this.closeNoteModal();
  }

  saveNewAnnotation() {
    this.bookService.annotations.push(this.annotation);
  }

  updateAnnotation() {
    const annotationIndex: number = this.bookService.getAnnotationIndexByCfi(
      this.annotation.cfi
    );
    this.bookService.annotations[annotationIndex] = this.annotation;
  }

  /**
   * Restores the current annotation to its previous state.
   * This method retrieves the most recent version of the annotation
   * based on its CFI (Canonical Fragment Identifier) and updates
   * the current annotation with the retrieved data. Afterward, it re-applies
   * the text marking based on the updated annotation.
   */
  restorePreviousAnnotationState() {
    if (!this.isEdition) {
      this.bookService.removeMark(this.annotation.cfi);
    } else {
      const currentAnnotation = this.bookService.getAnnotationByCfi(
        this.annotation.cfi
      );
      if (!currentAnnotation) return;
      this.annotation = currentAnnotation;
      this.markText();
    }
    this.closeNoteModal();
  }

  markText() {
    this.bookService.removeMark(this.annotation.cfi);
    this.bookService.mark(this.annotation.cfi, this.annotation.color, 0.5);
  }

  closeNoteModal() {
    this.noteModal.dismiss();
  }
}
