import { Email, EmailProvider } from './EmailProvider';
import { Queue } from './Queue';
import { RateLimiter } from './RateLimiter';

export class EmailService {
    private primaryProvider: EmailProvider;
    private secondaryProvider: EmailProvider;
    private queue: Queue<Email>;
    private rateLimiter: RateLimiter;
    private sentEmails: Set<string> = new Set();

    constructor(primaryProvider: EmailProvider, secondaryProvider: EmailProvider, rateLimitMs: number) {
        this.primaryProvider = primaryProvider;
        this.secondaryProvider = secondaryProvider;
        this.queue = new Queue<Email>();
        this.rateLimiter = new RateLimiter(rateLimitMs);
    }

    async send(email: Email): Promise<void> {
        if (this.sentEmails.has(email.id)) {
            console.log(`Email with ID ${email.id} already sent.`);
            return;
        }

        this.sentEmails.add(email.id);
        await this.queue.add(email, async (email) => {
            await this.rateLimiter.waitIfNeeded();
            try {
                await this.primaryProvider.send(email);
                console.log(`Email sent to ${email.to}`);
            } catch {
                try {
                    await this.secondaryProvider.send(email);
                    console.log(`Email sent to ${email.to} via fallback provider`);
                } catch {
                    console.error(`Failed to send email to ${email.to}`);
                }
            }
        });
    }
}
