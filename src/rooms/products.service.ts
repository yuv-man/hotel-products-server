import fs from 'fs/promises';
import path from 'path';
import { ProductAssignment, ProductCharge, ReservationProduct, ReservationSummary } from '../types';

const productAssignmentsPath: string = path.join(__dirname, '../db/product_assignment.json');
const productChargesPath: string = path.join(__dirname, '../db/product_charges.json');

/**
 * Asynchronously reads the product assignments data from the JSON file.
 * @returns {Promise<Array>} A promise that resolves to the array of product assignments.
 */
async function readProductAssignments(): Promise<ProductAssignment[]> {
    try {
        const data = await fs.readFile(productAssignmentsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading product assignments file:', error);
        return []; 
    }
}

/** 
 * Asynchronously reads the product charges data from the JSON file.
 * @returns {Promise<Array>} A promise that resolves to the array of product charges.
 */
async function readProductCharges(): Promise<ProductCharge[]> {
    try {
        const data = await fs.readFile(productChargesPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading product charges file:', error);
        return [];
    }
}

/**
 * Get all products assigned to a specific reservation
 * @param {string} reservationUuid - The reservation UUID to search for
 * @returns {Promise<Array>} A promise that resolves to the array of product assignments matching the reservation UUID.
 */
export async function getProductsByReservationUuid(reservationUuid: string): Promise<ReservationProduct[]> {
    const productAssignments = await readProductAssignments();
    const productCharges = await readProductCharges();
    const products = productAssignments.filter(
        assignment => assignment.reservation_uuid === reservationUuid
    );
    const reservationProducts = products.map(product => {
        const productCharge = productCharges.find(charge => charge.special_product_assignment_id === product.id);
        return {
            id: product.id,
            name: product.name,
            amount: productCharge?.amount || 0,
            active: productCharge?.active ?? false,
        };
    });
    return reservationProducts;
}

/**
 * Gets a summary of reservations with their product assignments and charges
 * @returns {Promise<Array>} Array of reservation summaries with charge information
 */
export async function getReservationSummaries(): Promise<ReservationSummary[]> {
    try {
        // Fetch data in parallel for better performance
        const [productAssignments, productCharges] = await Promise.all([
            readProductAssignments(),
            readProductCharges()
        ]);
        
        // Create a Map to store reservation UUIDs and their associated product data
        const reservationProductMap = new Map();
        
        // Create a lookup map for product charges to avoid repeated find() operations
        const chargesMap: Record<number, ProductCharge> = productCharges.reduce((map: Record<number, ProductCharge>, charge) => {
            map[charge.special_product_assignment_id] = charge;
            return map;
        }, {});
        
        // Process each product assignment
        productAssignments.forEach(assignment => {
            const { reservation_uuid, id, name } = assignment;
            const productCharge = chargesMap[id];
            
            // Determine product status and amount
            const isActive = productCharge?.active || false;
            const status = productCharge 
                ? (isActive ? "active" : "cancelled") 
                : "initial";
            const amount = productCharge?.amount || 0;
            
            // Create product data object
            const productData = {
                ...productCharge,
                name: name || "",
                status,
                amount
            };
            
            // Add to or update reservation in the map
            if (!reservationProductMap.has(reservation_uuid)) {
                reservationProductMap.set(reservation_uuid, {
                    amount: isActive ? amount : 0,
                    numOfCharges: isActive ? 1 : 0,
                    products: [productData]
                });
            } else {
                const reservation = reservationProductMap.get(reservation_uuid);
                // Only update amount and count for active charges
                if (isActive) {
                    reservation.amount += amount;
                    reservation.numOfCharges++;
                }
                reservation.products.push(productData);
            }
        });
        
        // Convert Map to array of reservations with their UUIDs
        return Array.from(reservationProductMap, ([reservation_uuid, data]) => ({
            reservation_uuid,
            ...data
        }));
    } catch (error) {
        console.error('Error getting reservation summaries:', error);
        throw error; // Re-throw to allow calling code to handle the error
    }
}