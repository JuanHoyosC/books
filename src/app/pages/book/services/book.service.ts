import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  GestureController,
  GestureDetail,
  IonModal,
  ModalController,
} from '@ionic/angular';
import ePub, { Contents, NavItem, Rendition } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
import { SpineItem } from 'epubjs/types/section';
import { SettingService, Theme } from './setting-book.service';
import { DisplayedLocation, Location } from 'epubjs/types/rendition';
import { NoteComponent } from '../components/note/note.component';
import { Subject } from 'rxjs';
import Epub from 'epubjs';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  //Services
  private settingService = inject(SettingService);
  private gestureCtrl = inject(GestureController);

  rendition!: Rendition;
  rendition2!: Rendition;
  metadata!: PackagingMetadataObject;
  currentLocation!: Location;
  isCurrentLocationMarker: boolean = false;
  initialTouchDistance: number | null = null;

  annotations: Annotation[] = [];
  chapters: NavItem[] = [];
  bookMarkedPages: PageMarked[] = [];
  noteColors: string[] = ['#ff9999', '#99ff99', '#99ccff'];

  //pagination
  loadingPagination: boolean = false;
  pages: Page[] = [];
  currentPage: Page | undefined = undefined;
  totalPages: number = 0;
  currentPageIndex: WritableSignal<number> = signal(0);
  isCurrentPageMarker: WritableSignal<boolean> = signal(false);

  //Modals
  settingModal: IonModal | undefined = undefined;
  noteModal: IonModal | undefined = undefined;

  //Mark text
  currentAnnotation: Annotation | undefined = {
    cfi: '',
    color: '',
    content: '',
    note: '',
  };
  isCurrentSelectedActive: boolean = false;

  //=============== Modal note view =============================
  setNoteModal(modal: IonModal) {
    this.noteModal = modal;
  }

  getNoteModal(): IonModal | undefined {
    return this.noteModal;
  }

  //=============== Modal Setting view =============================

  setSettingModal(modal: IonModal) {
    this.settingModal = modal;
  }

  getSettingModal(): IonModal | undefined {
    return this.settingModal;
  }

  async readBook() {
    const book = ePub('./assets/book3.epub');
    const rendition = book.renderTo('current', {
      flow: 'paginated',
      manager: 'continuous',
      spread: 'always',
      width: '100%',
      height: 'calc(100vh - 40px)',
      snap: true,
      resizeOnOrientationChange: true,
    });

    const rendition2 = book.renderTo('hidden', {
      flow: 'paginated',
      manager: 'continuous',
      spread: 'always',
      width: '100%',
      height: 'calc(100vh - 40px)',
      snap: true,
      resizeOnOrientationChange: true,
    });

    await rendition.display();
    book.ready.then(async () => {
      this.setRendition(rendition);
      this.onNavigation();
      this.onLocation();
      this.onSelected();
      this.onMarkClicked();
      this.setMetada();
      this.onSwipeGesture();
      await rendition2.display();
      this.rendition2 = rendition2;
      this.calculatePagination();
    });
  }

  next() {
    this.rendition.next();
  }

  async calculatePagination() {
    this.pages = [];
    this.loadingPagination = true;
    const pages: Page[] = [];
    let index = 1;
    let location: any = this.rendition2.currentLocation();
    pages.push({ location, index });
    while (location && !location.atEnd) {
      await this.rendition2.next();
      location = this.rendition2.currentLocation();
      index++;
      pages.push({ location, index });
    }

    this.pages = [...pages];
    this.totalPages = this.pages.length;
    this.setcurrentPage();
    this.loadingPagination = false;
    //this.rendition2.destroy();
  }

  setRendition(rendition: Rendition) {
    this.rendition = rendition;
  }

  //==================================== Setting the current book ====================================

  setFont(font: string) {
    this.rendition.themes.font(font);
  }

  setFontSize(fontSize: number) {
    this.rendition.themes.fontSize(`${fontSize}px`);
    this.updateAllAnotiations();
    this.calculatePagination();
  }

  setlineHeight(lineHeight: number) {
    const theme = 'lineHeight';
    this.rendition.themes.register(theme, {
      p: { 'line-height': `${lineHeight}` },
    });

    this.rendition.themes.select(theme);
  }

  setMargin(margin: number) {
    const theme = 'margin';
    this.rendition.themes.register(theme, {
      body: { padding: `${margin}px !important` },
    });

    this.rendition.themes.select(theme);
  }

  setHyphen(hyphen: 'auto' | 'none') {
    const theme = 'hyphens';
    this.rendition.themes.register(theme, {
      p: { hyphens: `${hyphen}` },
    });

    this.rendition.themes.select(theme);
  }

  setTheme(theme: Theme) {
    this.rendition.themes.select(theme.name);
  }

  //==================================== Events ====================================

  onNavigation() {
    this.rendition.book.loaded.navigation.then(() => {
      this.chapters = this.rendition.book.navigation.toc;
    });
  }

  onLocation() {
    this.rendition.on('relocated', async (location: Location) => {
      this.currentLocation = location;
      const isCurrentLocationMarker =
        this.getBookMarkedPageIndex(location.start.cfi) !== -1;
      this.setIsCurrentLocationMarker(isCurrentLocationMarker);
      this.setSelectionStyle();
    });
  }

  onSelectedTimeout: number = 0;
  onSelected() {
    this.rendition.on('selected',(cfi: string) => {
      clearTimeout(this.onSelectedTimeout);
      this.onSelectedTimeout = setTimeout(() => {
        if (!this.isCurrentSelectedActive) {
          this.openNoteComponent(cfi);
        }
      }, 500) as unknown as number; // Garantizamos que el resultado sea tratado como número
    });
  }

  onMarkClicked() {
    this.rendition.on('markClicked', (cfi: string) => {
      this.openNoteComponent(cfi);
    });
  }

  openNoteComponent(cfi: string) {
    this.currentAnnotation = this.getAnnotationFromCfi(cfi);
    this.isCurrentSelectedActive = true;
    this.removeAllIframeRanges();
    this.noteModal?.present();
  }

  getAnnotationFromCfi(cfi: string): Annotation {
    const annotation = this.getAnnotationByCfi(cfi);
    if (annotation) return annotation;
    return this.createAnnotation(cfi);
  }

  createAnnotation(cfi: string): Annotation {
    return {
      cfi,
      color: this.noteColors[0],
      content: this.getContentTextFromCurrentIframeSelection(),
      note: '',
    };
  }

  getAnnotationByCfi(cfi: string): Annotation | undefined {
    return this.annotations.find((annotation) => annotation.cfi === cfi);
  }

  getAnnotationIndexByCfi(cfi: string): number {
    return this.annotations.findIndex((annotation) => annotation.cfi === cfi);
  }

  getContentTextFromCurrentIframeSelection() {
    const iframe = document.querySelector('iframe');
    const selection = iframe?.contentDocument?.getSelection();
    if (!selection || selection?.rangeCount === 0) return '';
    const range = selection.getRangeAt(0);
    return this.getCompleteSelectionText(range);
  }

  getCompleteSelectionText(range: Range): string {
    let selectedText = '';
    const documentFragment = range.cloneContents();
    documentFragment.childNodes.forEach((node) => {
      selectedText += this.getTextFromNode(node);
    });

    return selectedText;
  }

  getTextFromNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    let text = '';
    node.childNodes.forEach((childNode) => {
      text += this.getTextFromNode(childNode);
    });
    return text;
  }

  //==================================== Gesture Events ====================================

  onSwipeGesture() {
    this.rendition.hooks.content.register((contents: Contents) => {
      const el = contents.document.documentElement;
      if (!el) return;
      el.lang = this.metadata.language;
      this.onSwipeX(el);
      this.onSwipeY(el);
      this.onClick(el);
    });
  }

  onSwipeX(el: Node) {
    //Enable swipe gesture to flip a page
    let start: Touch;
    let end: Touch;
    const rendition = this.rendition;
    el.addEventListener('touchstart', (event: any) => {
      const ev = event as TouchEvent;
      start = ev.changedTouches[0];
    });

    el.addEventListener('touchend', (event: any) => {
      const ev = event as TouchEvent;
      end = ev.changedTouches[0];
      const elBook = document.querySelector('app-book');
      if (elBook) {
        const bound = elBook.getBoundingClientRect();
        const hr = (end.screenX - start.screenX) / bound.width;
        const vr = Math.abs((end.screenY - start.screenY) / bound.height);
        if (hr > 0.25 && vr < 0.1) return rendition.prev();
        if (hr < -0.25 && vr < 0.1) return this.next();
      }
      return undefined;
    });
  }

  onSwipeY(el: Element) {
    const gesture = this.gestureCtrl.create({
      el: el,
      gestureName: 'swipe-to-control-brightness',
      direction: 'y',
      onMove: (detail: GestureDetail) => {
        const event = detail.event as TouchEvent;
        if (event.touches.length === 1) {
          this.onSigleTouch(detail);
        } else if (event.touches.length === 2) {
          this.onDobleTouch(event);
        }
      },
      onEnd: () => {
        this.initialTouchDistance = null;
      },
    });

    gesture.enable();
  }

  getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.pageX - touch2.pageX; // Diferencia en la coordenada X
    const dy = touch1.pageY - touch2.pageY; // Diferencia en la coordenada Y
    return Math.sqrt(dx * dx + dy * dy); // Teorema de Pitágoras para calcular la distancia
  }

  onDobleTouch(event: TouchEvent) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const currentDistance = this.getDistance(touch1, touch2);
    if (this.initialTouchDistance === null) {
      this.initialTouchDistance = currentDistance;
    } else {
      let fontSize = this.settingService.setting.fontSize;
      const scaleFactor = (currentDistance - this.initialTouchDistance) * 0.03;
      fontSize = Math.ceil(Math.max(8, Math.min(fontSize + scaleFactor, 32))); // Limitar entre 8px y 32px

      this.settingService.setFontSize(Math.ceil(fontSize));
      this.setFontSize(Math.ceil(fontSize));
    }
  }

  onSigleTouch(detail: GestureDetail) {
    const height = detail.event.view?.outerHeight ?? 100; // Altura de la pantalla
    const deltaY = detail.currentY - detail.startY; // Diferencia de desplazamiento Y

    const brightnessChange = -(deltaY / height);
    this.settingService.getBrightness().then((brightness) => {
      const newBrightness = Math.min(
        Math.max(brightness + brightnessChange, 0),
        1
      ); // Normalizar entre 0 y 1
      this.settingService.setBrightness(newBrightness);
    });
  }

  onClick(el: Element) {
    el.addEventListener('click', (event: Event) => {
      this.onPagination(event as PointerEvent);
      this.openExternalLink(event);
    });
  }

  /**
   * Handles pagination based on the click location within the iframe.
   * Determines if the click occurred in the first 25%, the last 25%, or the center (50%) of the page.
   * - First 25%: navigates to the previous page.
   * - Last 25%: navigates to the next page.
   * - Center: opens the settings modal.
   *
   * @param event - Click event containing the coordinates of the click.
   */
  onPagination(event: PointerEvent) {
    const iframeContentDocument = this.getIframeContentDocument();
    const iframeBody = iframeContentDocument?.body;

    if (!iframeBody) return;

    const clickPositionX = event.clientX;
    const iframeWidth = iframeBody.getBoundingClientRect().width;

    // Calculate the relative position of the click in relation to the iframe width
    const section = Math.ceil(clickPositionX / iframeWidth);

    // Define the boundaries of the section where the click occurred
    const sectionStart = iframeWidth * (section - 1);
    const sectionEnd = iframeWidth * section;

    // Calculate the first and last 25% of the section width
    const firstQuarterBoundary = sectionStart + iframeWidth * 0.25;
    const lastQuarterBoundary = sectionEnd - iframeWidth * 0.25;

    if (clickPositionX <= firstQuarterBoundary) {
      this.rendition.prev();
    } else if (clickPositionX >= lastQuarterBoundary) {
      this.rendition.next();
    } else {
      this.openSettingModal();
    }
  }

  openExternalLink(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' && target.hasAttribute('href')) {
      const href = target.getAttribute('href');
      if (href) {
        window.open(href, '_blank'); // Abrir el enlace en una nueva pestaña
      }
    }
  }

  //==================================== Events ====================================
  openSettingModal() {
    this.settingModal?.present();
  }

  getcurrentPage(cfi: string): Page | undefined {
    return this.pages.find((pagination) => {
      if (!pagination?.location?.start) return false;
      return pagination.location.start.cfi === cfi;
    });
  }

  setcurrentPage() {
    const currentPage = this.getcurrentPage(this.currentLocation.start.cfi);
    if (currentPage) {
      this.currentPage = currentPage;
      localStorage.setItem('currentPage', JSON.stringify(currentPage));
      this.currentPageIndex.set(this.currentPage.index);
    }
  }

  get paginationProgress() {
    if (this.loadingPagination) return 0;
    return Math.floor((this.currentPageIndex() / this.totalPages) * 100);
  }

  markAndHighlightSearchText(cfi: string) {
    const iframeContentDocument = this.getIframeContentDocument();
    const contentRange: any = this.rendition.getRange(cfi);

    if (!iframeContentDocument || !contentRange) return;

    const iframeSelection = iframeContentDocument.getSelection();
    if (!iframeSelection) return;
    const range: Range = iframeContentDocument.createRange();
    range.setStart(contentRange.endContainer, contentRange.startOffset);
    range.setEnd(contentRange.endContainer, contentRange.endOffset);
    iframeSelection.removeAllRanges();
    iframeSelection.addRange(range);
  }

  setSelectionStyle() {
    const iframeContentDocument = this.getIframeContentDocument();
    if (!iframeContentDocument) return;
    const style = iframeContentDocument.createElement('style');
    style.textContent = `
    ::selection {
      background-color: #0026ff;
      color: #fff;
    }
    * {
      user-select: text !important; 
    }
  `;
  }

  setTransitionStyle(opacity: number) {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    iframe.style.transform = `translateX(-${opacity * 420}px)`;
    iframe.style.transition = 'all 0.5s linear';
  }

  getIframeContentDocument(): Document | undefined {
    const iframe = document.querySelector('iframe');

    // Verifica si el iframe y su documento están disponibles
    if (!iframe || !iframe.contentDocument) return undefined;

    return iframe.contentDocument;
  }

  removeAllIframeRanges() {
    const iframeContentDocument = this.getIframeContentDocument();
    const selection = iframeContentDocument?.getSelection();
    selection && selection.removeAllRanges();
  }

  setMetada() {
    this.rendition.book.loaded.metadata.then(
      (metadata: PackagingMetadataObject) => {
        this.metadata = metadata;
      }
    );
  }

  setIsCurrentLocationMarker(isMarker: boolean) {
    this.isCurrentPageMarker.set(isMarker);
  }

  async goToChapter(href: string) {
    await this.rendition.display(href);
  }

  updateAllAnotiations() {
    for (let annotation of this.annotations) {
      this.removeMark(annotation.cfi);
      this.mark(annotation.cfi, annotation.color, 0.5);
    }
  }

  mark(cfi: string, color: string, opacity: number) {
    this.rendition.annotations.add(
      'highlight',
      cfi,
      {},
      () => {},
      'highlight',
      {
        fill: color,
        'fill-opacity': opacity,
      }
    );
  }

  removeMark(cfiRange: string) {
    this.rendition.annotations.remove(cfiRange, 'highlight');
  }

  async savePage() {
    const pageIndex = this.getBookMarkedPageIndex(
      this.currentLocation.start.cfi
    );
    if (pageIndex === -1) {
      const newPage = this.createChapterMark();
      this.bookMarkedPages.push(newPage);
      this.setIsCurrentLocationMarker(true);
    } else {
      this.removeBookMarkedPage(pageIndex);
      this.setIsCurrentLocationMarker(false);
    }
  }

  createChapterMark(): PageMarked {
    return {
      cfi: this.currentLocation.start.cfi,
      date: new Date().toISOString(),
      index: this.currentPageIndex(),
    };
  }

  removeBookMarkedPage(pageIndex: number) {
    this.bookMarkedPages.splice(pageIndex, 1);
  }

  getBookMarkedPageIndex(cfi: string): number {
    return this.bookMarkedPages.findIndex(
      (page: PageMarked) => page.cfi === cfi
    );
  }

  async getBookPicture() {
    const cover = await this.rendition.book.loaded.cover;
    return this.rendition.book.resources.createUrl(cover);
  }

  async getRange(cfi: string): Promise<Range> {
    return this.rendition.book.getRange(cfi);
  }

  async search(query: string): Promise<SearchItem[]> {
    const book = this.rendition.book;
    const spine = book.spine as any as { spineItems: SpineItem[] };
    return Promise.all(
      spine.spineItems.map((item: any) =>
        item
          .load(book.load.bind(book))
          .then(item.find.bind(item, query))
          .finally(item.unload.bind(item))
      )
    ).then((results) => Promise.resolve([].concat.apply([], results)));
  }
}

type PageMarked = {
  cfi: string;
  index: number;
  date: string;
};

export type SearchItem = {
  cfi: string;
  excerpt: string;
};

export type CustomLocation = {
  end: string;
  href: string;
  index: number;
  percentage: number;
  start: string;
};

export type Page = {
  location: Location & { atStart?: boolean } & { atEnd?: boolean };
  index: number;
};

export type Annotation = {
  cfi: string;
  color: string;
  content: string;
  note: string;
};
