class ReservationCache {
    constructor() {
        this.cache = null;
        this.lastUpdated = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    set(data) {
        this.cache = data;
        this.lastUpdated = Date.now();
    }

    get() {
        if (!this.cache || !this.lastUpdated) {
            return null;
        }

        // Check if cache has expired
        if (Date.now() - this.lastUpdated > this.CACHE_DURATION) {
            this.invalidate();
            return null;
        }

        return this.cache;
    }

    invalidate() {
        this.cache = null;
        this.lastUpdated = null;
    }
}

export const reservationCache = new ReservationCache(); 