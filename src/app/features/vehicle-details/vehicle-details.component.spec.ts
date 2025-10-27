import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../shared/models/vehicle.model';
import { VEHICLES } from '../../../data/mock/vehicles.mock';

describe('VehicleDetailsComponent', () => {
    let component: VehicleDetailsComponent;
    let fixture: ComponentFixture<VehicleDetailsComponent>;
    let router: jasmine.SpyObj<Router>;
    let route: jasmine.SpyObj<ActivatedRoute>;
    let vehicleService: jasmine.SpyObj<VehicleService>;

    const mockVehicles: Vehicle[] = VEHICLES;
    const mockVehicle: Vehicle = VEHICLES[0];

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
            snapshot: {
                paramMap: new Map([['id', 'veh001']])
            }
        });

        const vehiclesSignal = signal(mockVehicles);
        const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getVehicleById']);
        vehicleServiceSpy.getVehicleById.and.returnValue(mockVehicle);
        vehicleServiceSpy.vehicles = vehiclesSignal;

        await TestBed.configureTestingModule({
            imports: [VehicleDetailsComponent],
            providers: [
                provideZonelessChangeDetection(),
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeSpy },
                { provide: VehicleService, useValue: vehicleServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleDetailsComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Initialization', () => {
        it('should load vehicle from route params', () => {
            expect(vehicleService.getVehicleById).toHaveBeenCalledWith('veh001');
            expect(component.vehicle()).toEqual(mockVehicle);
        });

        it('should have correct vehicle properties', () => {
            const vehicle = component.vehicle();
            expect(vehicle?.make).toBe('Toyota');
            expect(vehicle?.model).toBe('Camry');
            expect(vehicle?.year).toBe(2021);
            expect(vehicle?.price).toBe(23450);
            expect(vehicle?.mileage).toBe(15000);
        });
    });

    describe('Vehicle Not Found', () => {
        beforeEach(() => {
            vehicleService.getVehicleById.and.returnValue(undefined);
            fixture = TestBed.createComponent(VehicleDetailsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should set notFound to true when vehicle does not exist', () => {
            expect(component.notFound()).toBe(true);
            expect(component.vehicle()).toBeUndefined();
        });
    });

    describe('Navigation', () => {
        it('should navigate to vehicles list when goBack is called', () => {
            component.goBack();
            expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
        });
    });

    describe('Computed Properties', () => {
        it('should return vehicle when it exists', () => {
            expect(component.vehicle()).toBeDefined();
            expect(component.vehicle()).toEqual(mockVehicle);
        });

        it('should return notFound as false when vehicle exists', () => {
            expect(component.notFound()).toBe(false);
        });

        it('should return notFound as true when vehicle does not exist', () => {
            vehicleService.getVehicleById.and.returnValue(undefined);
            fixture = TestBed.createComponent(VehicleDetailsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            expect(component.notFound()).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty vehicle ID', () => {
            const emptyRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
                snapshot: {
                    paramMap: new Map([['id', '']])
                }
            });

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [VehicleDetailsComponent],
                providers: [
                    provideZonelessChangeDetection(),
                    { provide: Router, useValue: router },
                    { provide: ActivatedRoute, useValue: emptyRouteSpy },
                    { provide: VehicleService, useValue: vehicleService }
                ]
            });

            vehicleService.getVehicleById.and.returnValue(undefined);
            const emptyFixture = TestBed.createComponent(VehicleDetailsComponent);
            const emptyComponent = emptyFixture.componentInstance;
            emptyFixture.detectChanges();

            expect(emptyComponent.notFound()).toBe(true);
        });

        it('should handle invalid vehicle ID', () => {
            vehicleService.getVehicleById.and.returnValue(undefined);
            fixture = TestBed.createComponent(VehicleDetailsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            expect(component.notFound()).toBe(true);
            expect(component.vehicle()).toBeUndefined();
        });
    });
});
