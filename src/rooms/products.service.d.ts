import { ReservationProduct, ReservationSummary } from '../types.js';

export function getProductsByReservationUuid(reservationUuid: string): Promise<ReservationProduct[]>;
export function getReservationSummaries(): Promise<ReservationSummary[]>; 