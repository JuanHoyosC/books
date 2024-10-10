import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selected-button',
  templateUrl: './selected-button.component.html',
  styleUrls: ['./selected-button.component.scss'],
})
export class SelectedButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() fill: string = ''
  @Input() active: boolean = false;
  @Input() mode: 'auto' | 'background' = 'auto';
  @Input('--background') background: string = '';
  @Input('--border-color') borderColor: string= ''
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  onClickEmit() {
    this.onClick.emit();
  }

}
