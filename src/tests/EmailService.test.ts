import { EmailService } from '../src/EmailService';
import { MockEmailProvider } from '../src/EmailProvider';
import { expect } from 'chai';

describe('EmailService', () => {
    it('should retry and fallback on failure', async () => {
        // Setup mock providers
        const primaryProvider = new MockEmailProvider(0.5);
        const secondaryProvider = new MockEmailProvider();
        const emailService = new EmailService(primaryProvider, secondaryProvider, 1000);

        // Create a test email
        const email = { id: '1', to: 'test@example.com', subject: 'Test', body: 'This is a test' };

        // Spy on provider methods
        const primarySpy = spyOn(primaryProvider, 'send').and.callThrough();
        const secondarySpy = spyOn(secondaryProvider, 'send').and.callThrough();

        // Send the email
        await emailService.send(email);

        // Assert that the primary provider's send method was called
        expect(primarySpy).to.have.been.calledOnce;

        // Assert that the secondary provider's send method was called if primary failed
        expect(secondarySpy).to.have.been.calledOnce;
    });
});
