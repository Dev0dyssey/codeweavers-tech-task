import { Component,computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FinanceCalculatorComponent } from '../finance-calculator/finance-calculator.component';

@Component({
    selector: 'app-vehicle-details',
    templateUrl: './vehicle-details.component.html',
    styleUrl: './vehicle-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe, DecimalPipe, FinanceCalculatorComponent]
})
export class VehicleDetailsComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly vehicleService = inject(VehicleService);

    private readonly vehicleId = this.route.snapshot.paramMap.get('id') || '';
    readonly vehicle = computed(() => {
        return this.vehicleService.getVehicleById(this.vehicleId);
    })
    
    readonly notFound = computed(() => !this.vehicle());
    readonly vehiclePrice = computed(() => this.vehicle()!.price);

    goBack(): void {
        this.router.navigate(['/vehicles']);
    }
}