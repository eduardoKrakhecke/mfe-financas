import { Component } from '@angular/core';
import { CreateFinanceComponent } from '../../components/create-finance/create-finance.component';
import { ListFinanceComponent } from '../../components/list-finance/list-finance.component';

@Component({
  selector: 'app-financas',
  imports: [CreateFinanceComponent, ListFinanceComponent],
  templateUrl: './financas.component.html',
  styleUrl: './financas.component.scss',
  standalone: true
})
export class FinancasComponent {

}
