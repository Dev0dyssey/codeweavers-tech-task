import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicle-list/vehicle-list.component';

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
    // {
    //     path: 'vehicles/:id',
    //     loadComponent: () => import('./features/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent)
    // },
    {
        path: '**',
        redirectTo: '/vehicles',
    }
];
