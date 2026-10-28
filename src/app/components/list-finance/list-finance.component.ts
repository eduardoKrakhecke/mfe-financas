import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Lancamento, LancamentoService, TipoLancamento } from '../../services/lancamento.service';

type FiltroTipo = 'todos' | TipoLancamento;

@Component({
  selector: 'app-list-finance',
  imports: [ CommonModule, FormsModule, RouterLink ],
  templateUrl: './list-finance.component.html',
  styleUrl: './list-finance.component.scss',
  standalone: true
})
export class ListFinanceComponent {

  private readonly lancamentoService = inject(LancamentoService);

  readonly lancamentos = signal<Lancamento[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal('');

  readonly busca = signal('');
  readonly filtroTipo = signal<FiltroTipo>('todos');

  readonly totalReceitas = computed(() =>
    this.lancamentos()
      .filter(item => item.tipo === 'entrada')
      .reduce((total, item) => total + Number(item.valor || 0), 0)
  );

  readonly totalDespesas = computed(() =>
    this.lancamentos()
      .filter(item => item.tipo === 'saida')
      .reduce((total, item) => total + Number(item.valor || 0), 0)
  );

  readonly saldo = computed(() =>
    this.totalReceitas() - this.totalDespesas()
  );

  readonly lancamentosFiltrados = computed(() => {
    const termo = this.busca()
      .trim()
      .toLocaleLowerCase('pt-BR');

    const tipo = this.filtroTipo();

    return this.lancamentos()
      .filter(item =>
        tipo === 'todos' || item.tipo === tipo
      )
      .filter(item => {
        const descricao = item.descricao
          .toLocaleLowerCase('pt-BR');

        const categoria = item.categoria
          .toLocaleLowerCase('pt-BR');

        return !termo ||
          descricao.includes(termo) ||
          categoria.includes(termo);
      })
      .sort((a, b) =>
        b.data.localeCompare(a.data) ||
        (b.id ?? 0) - (a.id ?? 0)
      );
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.lancamentoService.listAll().subscribe({
      next: dados => {
        this.lancamentos.set(dados);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar lançamentos:', error);

        this.erro.set(
          'Não foi possível carregar os lançamentos. Verifique se a API está em execução.'
        );

        this.carregando.set(false);
      },
      complete: () => {
        this.carregando.set(false);
      }
    });
  }

  alterarFiltro(valor: string): void {
    if (
      valor === 'todos' ||
      valor === 'entrada' ||
      valor === 'saida'
    ) {
      this.filtroTipo.set(valor);
    }
  }


}
