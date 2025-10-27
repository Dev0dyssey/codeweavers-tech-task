import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './features/vehicle-details/vehicle-details.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/vehicles',
        pathMatch: 'full'
    },
    {
        path: 'vehicles',
        component: VehicleListComponent
    },
    {
        path: 'vehicles/:id',
        component: VehicleDetailsComponent
    },
    {
        path: '**',
        redirectTo: '/vehicles',
    }
];
