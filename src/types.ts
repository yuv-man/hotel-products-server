export interface ProductAssignment {
    id: number;
    name: string;
    reservation_uuid: string;
}

export interface ProductCharge {
    special_product_assignment_id: number;
    active: boolean;
    amount: number;
}

export interface ReservationProduct {
    id: number;
    name: string;
    amount: number;
    active: boolean;
}

export interface ReservationSummary {
    reservation_uuid: string;
    amount: number;
    numOfCharges: number;
    products: Array<ProductCharge & {
        name: string;
        status: string;
        amount: number;
    }>;
} 