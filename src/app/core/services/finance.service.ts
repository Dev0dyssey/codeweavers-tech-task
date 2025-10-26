import { computed, Injectable, signal } from "@angular/core";
import { FinanceQuote, FinanceCalculationInputs, FinanceCalculationResult } from "../../shared/models/finance.model";

/**
 * Service for calculating vehicle finance options.
 * Uses private signal + computed pattern for encapsulated state management.
 */
@Injectable({
    providedIn: 'root'
})
export class FinanceService {

    /**
     * Private signal - only this service can mutate.
     * Exposed via readonly computed to prevent external mutation.
     */
    private currentQuoteSignal = signal<FinanceCalculationResult | null>(null);
    
    /** Public readonly access to current quote - components cannot mutate. */
    readonly currentQuote = computed(() => this.currentQuoteSignal());
    
    calculateFinance(vehiclePrice: number, inputs: FinanceCalculationInputs): FinanceCalculationResult {
        const quote: FinanceQuote = {
            onTheRoadPrice: vehiclePrice,
            totalDeposit: inputs.deposit,
            totalAmountOfCredit: vehiclePrice - inputs.deposit,
            numberOfMonthlyPayments: inputs.term,
            monthlyPayment: (vehiclePrice - inputs.deposit) / inputs.term,
        };

        const result: FinanceCalculationResult = {
            quote,
            inputs
        };

        this.currentQuoteSignal.set(result);

        return result;
    }

    calculateDefaultFinance(vehiclePrice: number): FinanceCalculationResult {
        const defaultDeposit = vehiclePrice * 0.1; // 10% deposit
        const defaultTerm = 60; // 60 months default

        return this.calculateFinance(vehiclePrice, {
            deposit: defaultDeposit,
            term: defaultTerm
        });
    }

    isValidDeposit(vehiclePrice: number, deposit: number): boolean {
        return deposit > 0 && deposit <= vehiclePrice;
    }

    isValidTerm(term: number): boolean {
        return term > 0 && term <= 120;
    }

    // formatCurrency(amount: number): string {
    //     return new Intl.NumberFormat('en-GB', {
    //         style: 'currency',
    //         currency: 'GBP'
    //     }).format(amount);
    // }

    // formatMonthlyPayment(amount: number): string {
    //     return this.formatCurrency(amount);
    // }
}