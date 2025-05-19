type QueueItem<T> = {
  item: T;
  priority: number;
};

export class BidirectionalPriorityQueue<T> {
  private items: QueueItem<T>[] = [];

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
  }

  dequeueMin(): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    let minIndex = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (this.items[i].priority < this.items[minIndex].priority) {
        minIndex = i;
      }
    }
    return this.items.splice(minIndex, 1)[0];
  }

  dequeueMax(): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    let maxIndex = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (this.items[i].priority > this.items[maxIndex].priority) {
        maxIndex = i;
      }
    }
    return this.items.splice(maxIndex, 1)[0];
  }

  peekMin(): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    return this.items.reduce(
      (min, curr) => (curr.priority < min.priority ? curr : min),
      this.items[0]
    );
  }

  peekMax(): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    return this.items.reduce(
      (max, curr) => (curr.priority > max.priority ? curr : max),
      this.items[0]
    );
  }

  getSize(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.getSize() === 0;
  }
}
