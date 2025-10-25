export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    colour: string;
}

export enum VehicleSortField {
    PRICE = 'price',
    YEAR = 'year',
    MILEAGE = 'mileage'
}


export interface VehicleSortOptions {
    field: VehicleSortField;
    direction: SortDirection;
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}