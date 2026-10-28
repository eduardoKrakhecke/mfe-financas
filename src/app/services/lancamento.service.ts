import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

export type TipoLancamento = 'entrada' | 'saida';
export type Categoria = 'Moradia' | 'Alimentação' | 'Transporte'
  | 'Saúde e Bem-estar' | 'Educação' | 'Lazer e Estilo de Vida' | 'Compromissos Financeiros e Dívidas'
  | 'Salário' | 'Investimentos';

export interface Lancamento {
  id?: number;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  tipo: TipoLancamento;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/lancamentos';

  create(lancamento: Omit<Lancamento, 'id'>): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiUrl, lancamento);
  }

  listAll(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(this.apiUrl);
  }

}
