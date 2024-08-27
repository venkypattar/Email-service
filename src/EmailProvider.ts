export interface Email {
    id: string;
    to: string;
    subject: string;
    body: string;
}

export interface EmailProvider {
    send(email: Email): Promise<void>; // Ensure this returns a Promise<void>
}

export class MockEmailProvider implements EmailProvider {
    private successRate: number;

    constructor(successRate: number = 0.9) {
        this.successRate = successRate;
    }

    async send(email: Email): Promise<void> {
        if (Math.random() > this.successRate) {
            throw new Error("Failed to send email");
        }
    }
}
