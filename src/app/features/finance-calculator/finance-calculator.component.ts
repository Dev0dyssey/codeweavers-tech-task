import { Component, computed, inject, signal, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FinanceService } from '../../core/services/finance.service';
import { FinanceCalculationInputs, FinanceCalculationResult } from '../../shared/models/finance.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-finance-calculator',
    templateUrl: './finance-calculator.component.html',
    styleUrl: './finance-calculator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CurrencyPipe, ReactiveFormsModule]
})
export class FinanceCalculatorComponent {
    private readonly financeService = inject(FinanceService);
    readonly vehiclePrice = input.required<number>();
    readonly maxTerm = signal(120);
    readonly defaultDeposit = computed(() => this.vehiclePrice() * 0.1);
    readonly depositControl = new FormControl<number>(0, [
        Validators.required,
        Validators.min(0)
    ])

    readonly termControl = new FormControl<number>(60, [
        Validators.required,
        Validators.min(1),
    ]);

    readonly deposit = toSignal(this.depositControl.valueChanges, { initialValue: 0 });
    readonly term = toSignal(this.termControl.valueChanges, { initialValue: 60 });

    readonly financeQuote = computed<FinanceCalculationResult | null>(() => {
        const vehiclePrice = this.vehiclePrice();
        const deposit = this.deposit() ?? 0;
        const term = this.term() ?? 60;

        if (!vehiclePrice || deposit < 0 || term < 1) {
            return null;
        }

        return this.financeService.calculateFinance(vehiclePrice, {
            deposit,
            term
        });
    });

    readonly hasErrors = computed(() => {
        return this.depositControl.invalid || this.termControl.invalid || this.termControl.invalid;
    })

    readonly isValid = computed(() => {
        return this.depositControl.valid && this.termControl.valid && this.vehiclePrice() > 0;
    })

    private clampInputValue(event: Event, control: FormControl<number | null>, min: number, max: number): void {
        const input = event.target as HTMLInputElement;
        let value = Number(input.value);
        
        if (isNaN(value)) return;
        
        const originalValue = value;
        
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        
        if (value !== originalValue) {
            control.setValue(value, { emitEvent: false });
            input.value = value.toString();
            control.updateValueAndValidity({ emitEvent: true });
        }
    }

    onDepositInput(event: Event): void {
        this.clampInputValue(event, this.depositControl, 0, this.vehiclePrice());
    }

    onTermInput(event: Event): void {
        this.clampInputValue(event, this.termControl, 1, this.maxTerm());
    }

    constructor() {
        effect(() => {
            if (this.depositControl.value === 0) {
                this.depositControl.setValue(this.defaultDeposit());
            }
        });
    }
}