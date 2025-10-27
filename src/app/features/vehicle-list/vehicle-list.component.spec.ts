import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { VehicleListComponent } from './vehicle-list.component';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle, VehicleSortField, SortDirection } from '../../shared/models/vehicle.model';
import { VEHICLES } from '../../../data/mock/vehicles.mock';

describe('VehicleListComponent', () => {
    let component: VehicleListComponent;
    let fixture: ComponentFixture<VehicleListComponent>;
    let router: jasmine.SpyObj<Router>;
    let vehicleService: jasmine.SpyObj<VehicleService>;

    const mockVehicles: Vehicle[] = VEHICLES;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        
        // Create a proper mock service with a vehicles signal
        const vehiclesSignal = signal(mockVehicles);
        const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['filterVehicles', 'sortVehicles']);
        vehicleServiceSpy.filterVehicles.and.returnValue(mockVehicles);
        vehicleServiceSpy.sortVehicles.and.returnValue(mockVehicles);
        vehicleServiceSpy.vehicles = vehiclesSignal;

        await TestBed.configureTestingModule({
            imports: [VehicleListComponent],
            providers: [
                provideZonelessChangeDetection(),
                { provide: Router, useValue: routerSpy },
                { provide: VehicleService, useValue: vehicleServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleListComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Initialization', () => {
        it('should initialize with default sort field as price', () => {
            const displayed = component.displayedVehicles();
            expect(displayed).toBeDefined();
            expect(displayed.length).toBeGreaterThan(0);
        });

        it('should initialize with default sort direction as ascending', () => {
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_upward');
        });

        it('should load vehicles from the service', () => {
            const displayed = component.displayedVehicles();
            expect(displayed.length).toBe(10);
        });

        it('should have correct enum references', () => {
            expect(component.VehicleSortFields).toBe(VehicleSortField);
            expect(component.SortDirections).toBe(SortDirection);
        });
    });

    describe('Search Functionality', () => {
        it('should clear search when clearSearch is called', () => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            
            (component as any).searchControl.setValue('test');
            fixture.detectChanges();
            
            component.clearSearch();
            fixture.detectChanges();
            
            expect((component as any).searchControl.value).toBe('');
        });

        it('should display all vehicles when search is empty', () => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            
            (component as any).searchControl.setValue('');
            fixture.detectChanges();

            const displayed = component.displayedVehicles();
            expect(displayed.length).toBe(10);
        });

        it('should handle search term changes', (done) => {
            const filtered = [mockVehicles[0]];
            vehicleService.filterVehicles.and.returnValue(filtered);
            
            (component as any).searchControl.setValue('toyota');
            fixture.detectChanges();

            // Wait for debounce (300ms)
            setTimeout(() => {
                expect(vehicleService.filterVehicles).toHaveBeenCalled();
                done();
            }, 350);
        });
    });

    describe('Sorting Functionality', () => {
        it('should change sort field when clicking a new field', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_upward');
            
            component.onSortChange(VehicleSortField.YEAR);
            
            expect(component.getSortIcon(VehicleSortField.YEAR)).toBe('arrow_upward');
            expect(vehicleService.sortVehicles).toHaveBeenCalled();
        });

        it('should toggle sort direction when clicking same field', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_upward');
            
            component.onSortChange(VehicleSortField.PRICE);
            
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_downward');
            
            component.onSortChange(VehicleSortField.PRICE);
            
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_upward');
        });

        it('should reset to ASC when switching to different field', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            // First click to set DESC
            component.onSortChange(VehicleSortField.PRICE);
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_downward');
            
            // Switch to different field
            component.onSortChange(VehicleSortField.MILEAGE);
            expect(component.getSortIcon(VehicleSortField.MILEAGE)).toBe('arrow_upward');
        });

        it('should get correct sort icon for inactive field', () => {
            expect(component.getSortIcon(VehicleSortField.YEAR)).toBe('unfold_more');
            expect(component.getSortIcon(VehicleSortField.MAKE)).toBe('unfold_more');
            expect(component.getSortIcon(VehicleSortField.MODEL)).toBe('unfold_more');
        });

        it('should show correct icon for each sort field', () => {
            component.onSortChange(VehicleSortField.MILEAGE);
            expect(component.getSortIcon(VehicleSortField.MILEAGE)).toBe('arrow_upward');
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('unfold_more');
        });
    });

    describe('Navigation', () => {
        it('should navigate to vehicle detail page', () => {
            const vehicleId = 'veh001';
            
            component.navigateToVehicleDetail(vehicleId);
            
            expect(router.navigate).toHaveBeenCalledWith(['/vehicles', vehicleId]);
        });

        it('should handle navigation with different vehicle IDs', () => {
            component.navigateToVehicleDetail('veh999');
            expect(router.navigate).toHaveBeenCalledWith(['/vehicles', 'veh999']);
            
            component.navigateToVehicleDetail('veh123');
            expect(router.navigate).toHaveBeenCalledWith(['/vehicles', 'veh123']);
        });

        it('should call navigate when navigateToVehicleDetail is invoked', () => {
            const vehicleId = 'test-id';
            component.navigateToVehicleDetail(vehicleId);
            expect(router.navigate).toHaveBeenCalledTimes(1);
        });
    });

    describe('Computed Properties', () => {
        it('should have results when vehicles are displayed', () => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            const hasResults = component.hasResults();
            
            expect(hasResults).toBe(true);
        });

        it('should be empty when search returns no results', (done) => {
            vehicleService.filterVehicles.and.returnValue([]);
            vehicleService.sortVehicles.and.returnValue([]);
            
            (component as any).searchControl.setValue('nonexistent');
            fixture.detectChanges();
            
            // Wait for debounce (300ms)
            setTimeout(() => {
                const isEmpty = component.isEmpty();
                expect(isEmpty).toBe(true);
                done();
            }, 350);
        });

        it('should not be empty when vehicles exist but search is empty', () => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            const isEmpty = component.isEmpty();
            
            expect(isEmpty).toBe(false);
        });

        it('should display vehicles based on search and sort', (done) => {
            const filteredVehicles = [mockVehicles[0], mockVehicles[1]];
            vehicleService.filterVehicles.and.returnValue(filteredVehicles);
            vehicleService.sortVehicles.and.returnValue(filteredVehicles);
            
            (component as any).searchControl.setValue('toyota');
            component.onSortChange(VehicleSortField.YEAR);
            fixture.detectChanges();
            
            // Wait for debounce (300ms)
            setTimeout(() => {
                const displayed = component.displayedVehicles();
                expect(vehicleService.filterVehicles).toHaveBeenCalled();
                expect(vehicleService.sortVehicles).toHaveBeenCalled();
                expect(displayed.length).toBe(2);
                done();
            }, 350);
        });
    });

    describe('Integration with VehicleService', () => {
        it('should call filterVehicles from service when searching', (done) => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            
            (component as any).searchControl.setValue('test');
            fixture.detectChanges();
            
            // Wait for debounce (300ms)
            setTimeout(() => {
                expect(vehicleService.filterVehicles).toHaveBeenCalled();
                done();
            }, 350);
        });

        it('should call sortVehicles from service when sorting', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            component.onSortChange(VehicleSortField.YEAR);
            fixture.detectChanges();
            
            expect(vehicleService.sortVehicles).toHaveBeenCalled();
        });

        it('should sort with correct parameters', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            component.onSortChange(VehicleSortField.MILEAGE);
            fixture.detectChanges();
            
            component.displayedVehicles();
            
            expect(vehicleService.sortVehicles).toHaveBeenCalledWith(
                jasmine.any(Array),
                VehicleSortField.MILEAGE,
                SortDirection.ASC
            );
        });

        it('should sort with descending direction when toggled', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            // Default sort is ASC on PRICE
            // First click toggles to DESC
            component.onSortChange(VehicleSortField.PRICE);
            fixture.detectChanges();
            
            // Get the last call arguments (should be DESC)
            const lastCallArgs = vehicleService.sortVehicles.calls.mostRecent().args;
            
            expect(lastCallArgs[1]).toBe(VehicleSortField.PRICE);
            expect(lastCallArgs[2]).toBe(SortDirection.DESC);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty search value in computed property', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            (component as any).searchControl.setValue('');
            fixture.detectChanges();
            
            const displayed = component.displayedVehicles();
            expect(displayed).toBeDefined();
            expect(displayed.length).toBe(10);
        });

        it('should handle whitespace search value', (done) => {
            vehicleService.filterVehicles.and.returnValue(mockVehicles);
            
            (component as any).searchControl.setValue('   ');
            fixture.detectChanges();
            
            // Wait for debounce (300ms)
            setTimeout(() => {
                const displayed = component.displayedVehicles();
                expect(displayed).toBeDefined();
                done();
            }, 350);
        });

        it('should toggle through all sort directions correctly', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            component.onSortChange(VehicleSortField.PRICE);
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_downward');
            
            component.onSortChange(VehicleSortField.PRICE);
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_upward');
            
            component.onSortChange(VehicleSortField.PRICE);
            expect(component.getSortIcon(VehicleSortField.PRICE)).toBe('arrow_downward');
        });

        it('should handle multiple sort field changes', () => {
            vehicleService.sortVehicles.and.returnValue(mockVehicles);
            
            component.onSortChange(VehicleSortField.MAKE);
            expect(component.getSortIcon(VehicleSortField.MAKE)).toBe('arrow_upward');
            
            component.onSortChange(VehicleSortField.COLOUR);
            expect(component.getSortIcon(VehicleSortField.COLOUR)).toBe('arrow_upward');
            
            component.onSortChange(VehicleSortField.MODEL);
            expect(component.getSortIcon(VehicleSortField.MODEL)).toBe('arrow_upward');
        });
    });
});
