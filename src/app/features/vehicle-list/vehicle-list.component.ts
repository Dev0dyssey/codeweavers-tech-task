import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle, VehicleSortField, SortDirection } from '../../shared/models/vehicle.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';


@Component({
    selector: 'app-vehicle-list',
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CurrencyPipe,
        DecimalPipe,
        ReactiveFormsModule
    ]
})

export class VehicleListComponent {
    private readonly router = inject(Router);
    private readonly vehicleService = inject(VehicleService);

    protected readonly allVehicles = this.vehicleService.vehicles();
    protected searchControl = new FormControl('');
    protected readonly searchTerm = toSignal(
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            map(value => value || ''),
            startWith('')
        ),
        { initialValue: '' }
    );
    protected sortField = signal<VehicleSortField>(VehicleSortField.PRICE);
    protected sortDirection = signal<SortDirection>(SortDirection.ASC);

    readonly displayedVehicles = computed(() => {
        let vehicles = this.allVehicles;

        if (this.searchTerm().trim()) {
            vehicles = this.vehicleService.filterVehicles(this.searchTerm());
        }

        vehicles = this.vehicleService.sortVehicles(
            vehicles,
            this.sortField(),
            this.sortDirection()
        )

        return vehicles;
    });

    readonly hasResults = computed(() => this.displayedVehicles().length > 0);
    readonly isEmpty = computed(() => !this.hasResults() && this.allVehicles.length > 0);

    readonly VehicleSortFields = VehicleSortField;
    readonly SortDirections = SortDirection;

    clearSearch(): void {
        this.searchControl.setValue('');
    }

    onSortChange(field: VehicleSortField): void {
        if (this.sortField() === field) {
          this.sortDirection.update(current => 
            current === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
          )
        } else {
            this.sortField.set(field);
            this.sortDirection.set(SortDirection.ASC);
        }
    }

    navigateToVehicleDetail(vehicleId: string): void {
        this.router.navigate(['/vehicles', vehicleId]);
    }

    getSortIcon(field: VehicleSortField): string {
        if (this.sortField() !== field) {
            return 'unfold_more';
        }
        return this.sortDirection() === SortDirection.ASC ? 'arrow_upward' : 'arrow_downward';
    }
}