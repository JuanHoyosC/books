import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ion-button-loading',
  templateUrl: './ion-button-loading.component.html',
  styleUrls: ['./ion-button-loading.component.scss'],
})
export class IonButtonLoadingComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() text: string = ''
  @Input() type: string = 'button';
}
