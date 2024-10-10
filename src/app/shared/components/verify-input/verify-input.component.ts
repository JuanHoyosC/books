import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-verify-input',
  templateUrl: './verify-input.component.html',
  styleUrls: ['./verify-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerifyInputComponent),
      multi: true,
    },
  ],
})
export class VerifyInputComponent implements ControlValueAccessor, OnChanges {
  @ViewChildren(IonInput) ionInputs!: QueryList<IonInput>;
  @Input() positions: number = 0;
  @Input() label: string = '';
  digits: Digit[] = [];
  value: string | undefined = undefined; // Valor interno del input
  isDisabled: boolean = false; // Estado de deshabilitado
  constructor() {}

  ngOnChanges(): void {
    for (let i = 0; i < this.positions; i++) {
      this.digits.push({ digit: undefined });
    }
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

  // Cuando el valor del input cambia
  onInput() {
    this.value = this.getValue();
    this.onChange(this.value); // Actualiza el valor en el formulario de Angular
  }

  getValue() {
    return this.digits
      .filter(({ digit }: Digit) => digit !== undefined)
      .map(({ digit }) => digit)
      .join('');
  }

  // Cuando el input es tocado
  onBlur() {
    this.onTouched();
  }

  validateSingleDigit(event: any, digitPos: number) {
    const currentIonInput = this.getIonInput(digitPos);
    if (!this.isNumeric(event.detail.value) && currentIonInput && event.detail.value !== '') {
      currentIonInput.value = '';
      return;
    }
    let inputValue = event.detail.value;
    inputValue = inputValue.length == 0 ? undefined : inputValue.at(-1);

    event.target.value = inputValue;
    this.digits[digitPos].digit = inputValue;
    this.onInput();
    const nextPos = inputValue !== undefined ? digitPos + 1 : digitPos - 1;
    this.setInputFocus(nextPos);
  }

  // Función que detecta si se presionó la tecla de borrar
  onKeyDown(event: KeyboardEvent, digitPos: number) {
    const key = event.key;
    if (
      ((key === 'Backspace' || key === 'Delete') &&
        !this.getIonInputValue(digitPos)) ||
      key === 'ArrowLeft'
    ) {
      this.setInputFocus(digitPos - 1);
    } else if (key === 'ArrowRight') {
      this.setInputFocus(digitPos + 1);
    }
  }

  // Función que se llama cuando el usuario pega algo en el input
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') ?? '';

    const isValidPaste = this.isValidPaste(pastedText);
    if (isValidPaste) {
      this.assignPastedTextToDigits(pastedText);
      this.setInputFocus(this.positions - 1);
    }
  }

  isValidPaste(pastedText: string): boolean {
    const isNumeric = this.isNumeric(pastedText); // Verifica si es numérico
    const isCorrectLength = pastedText.length === this.positions; // Verifica si tiene la longitud correcta
    return isNumeric && isCorrectLength; // Retorna true solo si ambas condiciones se cumplen
  }

  isNumeric(value: string) {
    return /^\d+$/.test(value);
  }

  assignPastedTextToDigits(pastedText: string) {
    this.digits = [];
    pastedText.split('').forEach((digit: string, index: number) => {
      this.digits.push({ digit: digit });
      this.setValueInIonInput(digit, index);
    });
    this.onInput();
  }

  setValueInIonInput(value: string, index: number) {
    const currentIonInput: IonInput | undefined = this.ionInputs.get(index);
    if (currentIonInput) {
      currentIonInput.value = value;
    }
  }

  getIonInputValue(index: number): string | number | undefined | null {
    const currentIonInput: IonInput | undefined = this.getIonInput(index);
    if (currentIonInput) {
      return currentIonInput.value;
    }
    return undefined;
  }

  getIonInput(index: number): IonInput | undefined {
    const currentIonInput: IonInput | undefined = this.ionInputs.get(index);
    if (currentIonInput) {
      return currentIonInput;
    }
    return undefined;
  }

  setInputFocus(nextPos: number) {
    if (nextPos === this.positions || nextPos < 0) return;
    const nextInput = this.ionInputs.find((input, index) => index === nextPos);
    if (nextInput) {
      setTimeout(() => {
        nextInput.getInputElement().then((element) => {
          nextInput.setFocus();
          if (element instanceof HTMLInputElement) {
            element.select();
          }
        });
      }, 0);
    }
  }
}

export type Digit = {
  digit: string | undefined;
};
