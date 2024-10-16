import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markText'
})
export class MarkTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, query: string): SafeHtml {
    const style = "background-color: var(--ion-color-primary); color: #fff; font-weight: 700";
      const regex = new RegExp(`(${query})`, 'gi');
      const highlightedText = value.replace(regex, `<span style="${style}">$1</span>`);
      return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

}
