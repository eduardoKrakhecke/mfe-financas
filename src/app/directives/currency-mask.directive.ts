import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: 'input[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true
    }
  ]
})
export class CurrencyMaskDirective implements ControlValueAccessor {

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>
  ) {}

  // Atualiza o valor exibido no input.
  writeValue(value: unknown): void {
    this.elementRef.nativeElement.value = this.formatarValor(value);
  }

  registerOnChange(
    fn: (value: number | null) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  // Aplica a máscara enquanto o usuário digita.
  @HostListener('input')
  onInput(): void {
    const input = this.elementRef.nativeElement;

    const digitos = input.value
      .replace(/\D/g, '')
      .slice(0, 12);

    if (!digitos) {
      input.value = '';
      this.onChange(null);
      return;
    }

    // Os dois últimos dígitos são os centavos.
    const valorNumerico = Number(digitos) / 100;

    // A máscara é aplicada no próprio campo.
    input.value = this.formatarValor(valorNumerico);

    // Mantém o cursor no final durante a digitação.
    const posicao = input.value.length;
    input.setSelectionRange(posicao, posicao);

    // O Angular recebe um número, não o texto formatado.
    this.onChange(valorNumerico);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private formatarValor(valor: unknown): string {
    if (
      valor === null ||
      valor === undefined ||
      valor === ''
    ) {
      return '';
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return '';
    }

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);
  }
}
