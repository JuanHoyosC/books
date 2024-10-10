import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RangeCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true,
    },
  ],
})
export class InputRangeComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() step: number = 1;
  @Input() pin: boolean = false;
  @Input() ticks: boolean = false;
  @Input() snaps: boolean = false;
  @Input() icon: string = '';
  @Output() change: EventEmitter<number> = new EventEmitter();

  value: number = 0; // Valor interno del input
  isDisabled: boolean = false; // Estado de deshabilitado

  pinFormatter(value: number) {
    return `${value}px`;
  }

  onIonChange(ev: Event) {
    this.value = (ev as RangeCustomEvent).detail.value as number;
    this.change.emit(this.value);
    this.onChange(this.value);
  }

  // Propiedades de ControlValueAccessor
  onChange = (value: any) => {};
  onTouched = () => {};

  // Se llama cuando Angular quiere escribir un valor en el input
  writeValue(value: any): void {
    this.value = value;
  }

  // Se llama cuando el valor cambia
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Se llama cuando el input es tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Se llama cuando se quiere cambiar el estado de deshabilitado
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
