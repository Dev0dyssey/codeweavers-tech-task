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
    MAKE = 'make',
    MODEL = 'model',
    YEAR = 'year',
    PRICE = 'price',
    MILEAGE = 'mileage',
    COLOUR = 'colour'
}


export interface VehicleSortOptions {
    field: VehicleSortField;
    direction: SortDirection;
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}