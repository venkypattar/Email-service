export class Queue<T> {
    private items: T[] = [];
    private processing = false;

    async add(item: T, process: (item: T) => Promise<void>): Promise<void> {
        this.items.push(item);
        if (!this.processing) {
            this.processing = true;
            while (this.items.length > 0) {
                const currentItem = this.items.shift();
                if (currentItem) {
                    await process(currentItem);
                }
            }
            this.processing = false;
        }
    }
}
