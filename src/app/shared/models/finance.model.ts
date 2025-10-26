export interface FinanceQuote {
    onTheRoadPrice: number;
    totalDeposit: number;
    totalAmountOfCredit: number;
    numberOfMonthlyPayments: number;
    monthlyPayment: number;
}

export interface FinanceCalculationInputs {
    readonly deposit: number;
    readonly term: number; // in months
}

export interface FinanceCalculationResult {
    quote: FinanceQuote;
    inputs: FinanceCalculationInputs;
}