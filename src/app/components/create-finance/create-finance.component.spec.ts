import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFinanceComponent } from './create-finance.component';

describe('CreateFinanceComponent', () => {
  let component: CreateFinanceComponent;
  let fixture: ComponentFixture<CreateFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
