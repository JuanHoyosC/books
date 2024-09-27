import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ion-button-loading',
  templateUrl: './ion-button-loading.component.html',
  styleUrls: ['./ion-button-loading.component.scss'],
})
export class IonButtonLoadingComponent  implements OnInit {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() text: string = ''
  @Input() type: string = 'button';

  constructor() { }

  ngOnInit() {}

}
