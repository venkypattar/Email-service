export class RateLimiter {
    private lastRequestTime: number = 0;
    private readonly limitMs: number;

    constructor(limitMs: number) {
        this.limitMs = limitMs;
    }

    async waitIfNeeded(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.limitMs) {
            await new Promise(resolve => setTimeout(resolve, this.limitMs - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();
    }
}
