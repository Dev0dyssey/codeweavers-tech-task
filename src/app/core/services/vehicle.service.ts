import { Injectable, signal, computed } from '@angular/core';
import { Vehicle, VehicleSortField, SortDirection } from '../../shared/models/vehicle.model';
import { VEHICLES } from '../../../data/mock/vehicles.mock';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    public vehicles = signal<Vehicle[]>(VEHICLES);
    private loading = signal(false);
    private error = signal<string | null>(null);

    readonly vehicleCount = computed(() => this.vehicles().length);
    readonly hasVehicles = computed(() => this.vehicleCount() > 0);
    readonly isLoading = computed(() => this.loading());
    readonly hasError = computed(() => this.error() !== null);

    getVehicleById(id: string): Vehicle | undefined {
        return this.vehicles().find(vehicle => vehicle.id === id);
    }

    async fetchVehicles(): Promise<Vehicle[]> {
        this.loading.set(true);
        this.error.set(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.vehicles.set(VEHICLES);
            return this.vehicles();
        } catch (error) {
            this.error.set('Failed to fetch vehicles');
            throw error;
        } finally {
            this.loading.set(false);
        }
    }

    sortVehicles(vehicles: Vehicle[], field: VehicleSortField, direction: SortDirection): Vehicle[] {


        return [...vehicles].sort((a, b) => {
            let aValue: number | string;
            let bValue: number | string;


            switch (field) {
                case VehicleSortField.PRICE:
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case VehicleSortField.YEAR:
                    aValue = a.year;
                    bValue = b.year;
                    break;
                case VehicleSortField.MILEAGE:
                    aValue = a.mileage;
                    bValue = b.mileage;
                    break;
                case VehicleSortField.MAKE:
                    aValue = a.make.toLowerCase();
                    bValue = b.make.toLowerCase();
                    break;
                case VehicleSortField.MODEL:
                    aValue = a.model.toLowerCase();
                    bValue = b.model.toLowerCase();
                    break;
                case VehicleSortField.COLOUR:
                    aValue = a.colour.toLowerCase();
                    bValue = b.colour.toLowerCase();
                    break;
                default:
                    throw new Error(`Invalid sort field: ${field}`);
            }

            if (direction === SortDirection.ASC) {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    filterVehicles(searchValue: string): Vehicle[] {
        if (!searchValue.trim()) {
            return this.vehicles();
        }

        const searchValueToLower = searchValue.toLowerCase();

        return this.vehicles().filter(vehicle => 
            Object.values(vehicle).some(value => 
                value.toString().toLowerCase().includes(searchValueToLower))
        );
    }
}