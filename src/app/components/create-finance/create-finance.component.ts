import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { LancamentoService, TipoLancamento } from '../../services/lancamento.service';
import { CurrencyMaskDirective } from '../../directives/currency-mask.directive';

function dataAtualLocal(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

@Component({
  selector: 'app-create-finance',
  imports: [ CommonModule, FormsModule, CurrencyMaskDirective ],
  templateUrl: './create-finance.component.html',
  styleUrl: './create-finance.component.scss',
  standalone: true
})
export class CreateFinanceComponent implements OnDestroy {

  private readonly lancamentoService = inject(LancamentoService);

  readonly descricao = signal('');
  readonly categoria = signal('');
  readonly valor = signal<number | null>(null);
  readonly tipo = signal<TipoLancamento>('saida');
  readonly data = signal(dataAtualLocal());
  readonly salvando = signal(false);
  readonly mensagem = signal('');
  readonly erro = signal('');
  private mensagemTimeout?: ReturnType<typeof setTimeout>;

  readonly categorias = [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Salário',
    'Investimentos',
    'Outros'
  ];


  readonly valorNumerico = computed(
    () => this.valor() ?? Number.NaN
  );

  readonly podeSalvar = computed(() => {
    const valorAtual = this.valorNumerico();

    return (
      this.descricao().trim().length > 0 &&
      this.categoria().length > 0 &&
      this.data().length > 0 &&
      valorAtual > 0 &&
      !this.salvando()
    );
  });

  readonly valorFormatado = computed(() =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valor() ?? 0)
  );

  alterarTipo(valor: string): void {
    if (valor === 'entrada' || valor === 'saida') {
      this.tipo.set(valor);
    }
  }

  salvar(): void {
    if (!this.podeSalvar()) {
      return;
    }

    this.salvando.set(true);
    this.mensagem.set('');
    this.erro.set('');

    const novoLancamento = {
      descricao: this.descricao().trim(),
      categoria: this.categoria(),
      valor: this.valorNumerico(),
      data: this.data(),
      tipo: this.tipo()
    };

    this.lancamentoService.create(novoLancamento).subscribe({
      next: () => {
        this.limparCampos();
        this.exibirMensagemSucesso(
          'Lançamento salvo com sucesso!'
        );
        this.salvando.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao salvar lançamento:', error);

        this.erro.set(
          'Não foi possível salvar. Verifique se o JSON Server está em execução.'
        );

        this.salvando.set(false);
      }
    });
  }

  limparCampos(): void {
    this.cancelarTimeoutMensagem();
    this.descricao.set('');
    this.categoria.set('Moradia');
    this.valor.set(null);
    this.data.set(dataAtualLocal());
    this.tipo.set('saida');
    this.mensagem.set('');
    this.erro.set('');
  }

  private converterValor(valorTexto: string): number {
    const texto = valorTexto.trim().replace(/\s/g, '');

    if (!texto) {
      return Number.NaN;
    }

    const normalizado = texto.includes(',')
      ? texto.replace(/\./g, '').replace(',', '.')
      : texto;

    return Number(normalizado);
  }

  private cancelarTimeoutMensagem(): void {
    if (this.mensagemTimeout !== undefined) {
      clearTimeout(this.mensagemTimeout);
      this.mensagemTimeout = undefined;
    }
  }

  private exibirMensagemSucesso(texto: string): void {
    this.cancelarTimeoutMensagem();

    this.mensagem.set(texto);

    this.mensagemTimeout = setTimeout(() => {
      this.mensagem.set('');
      this.mensagemTimeout = undefined;
    }, 4000);
  }

  ngOnDestroy(): void {
    this.cancelarTimeoutMensagem();
  }


}
