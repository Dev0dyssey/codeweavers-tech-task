import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, ComponentRef } from '@angular/core';
import { FinanceCalculatorComponent } from './finance-calculator.component';
import { FinanceService } from '../../core/services/finance.service';

describe('FinanceCalculatorComponent', () => {
  let component: FinanceCalculatorComponent;
  let fixture: ComponentFixture<FinanceCalculatorComponent>;
  let componentRef: ComponentRef<FinanceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceCalculatorComponent],
      providers: [provideZonelessChangeDetection(), FinanceService]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceCalculatorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    componentRef.setInput('vehiclePrice', 20000);
    fixture.detectChanges();

    expect(component.termControl.value).toBe(60);
    expect(component.defaultDeposit()).toBe(2000);
    expect(component.depositControl.value).toBe(2000);
  });

  it('should calculate finance quote correctly', () => {
    componentRef.setInput('vehiclePrice', 20000);
    fixture.detectChanges();
    
    component.depositControl.setValue(4000);
    component.termControl.setValue(48);
    fixture.detectChanges();

    const quote = component.financeQuote();
    expect(quote?.quote.onTheRoadPrice).toBe(20000);
    expect(quote?.quote.totalDeposit).toBe(4000);
    expect(quote?.quote.totalAmountOfCredit).toBe(16000);
    expect(quote?.quote.numberOfMonthlyPayments).toBe(48);
    expect(quote?.quote.monthlyPayment).toBeCloseTo(333.33, 2);
  });

  it('should validate form controls', () => {
    componentRef.setInput('vehiclePrice', 25000);
    fixture.detectChanges();
    
    component.depositControl.setValue(-100);
    expect(component.depositControl.invalid).toBe(true);

    component.depositControl.setValue(5000);
    expect(component.depositControl.valid).toBe(true);

    component.termControl.setValue(0);
    expect(component.termControl.invalid).toBe(true);

    component.termControl.setValue(48);
    expect(component.termControl.valid).toBe(true);
  });

  it('should clamp deposit within valid range', () => {
    componentRef.setInput('vehiclePrice', 30000);
    fixture.detectChanges();
    
    const maxEvent = { target: { value: '35000' } } as unknown as Event;
    component.onDepositInput(maxEvent);
    expect(component.depositControl.value).toBe(30000);

    const minEvent = { target: { value: '-1000' } } as unknown as Event;
    component.onDepositInput(minEvent);
    expect(component.depositControl.value).toBe(0);
  });

  it('should clamp term within valid range', () => {
    componentRef.setInput('vehiclePrice', 30000);
    fixture.detectChanges();
    
    const maxEvent = { target: { value: '150' } } as unknown as Event;
    component.onTermInput(maxEvent);
    expect(component.termControl.value).toBe(120);

    const minEvent = { target: { value: '0' } } as unknown as Event;
    component.onTermInput(minEvent);
    expect(component.termControl.value).toBe(1);
  });

  it('should validate component state', () => {
    componentRef.setInput('vehiclePrice', 25000);
    fixture.detectChanges();
    
    component.depositControl.setValue(5000);
    component.termControl.setValue(60);
    fixture.detectChanges();
    expect(component.isValid()).toBe(true);

    componentRef.setInput('vehiclePrice', 0);
    fixture.detectChanges();
    expect(component.isValid()).toBe(false);
  });

  it('should handle edge cases', () => {
    componentRef.setInput('vehiclePrice', 25000);
    fixture.detectChanges();

    component.depositControl.setValue(25000);
    component.termControl.setValue(60);
    const fullDepositQuote = component.financeQuote();
    expect(fullDepositQuote?.quote.totalAmountOfCredit).toBe(0);
    expect(fullDepositQuote?.quote.monthlyPayment).toBe(0);

    component.depositControl.setValue(5000);
    component.termControl.setValue(1);
    const oneMonthQuote = component.financeQuote();
    expect(oneMonthQuote?.quote.monthlyPayment).toBe(20000);
  });
});
