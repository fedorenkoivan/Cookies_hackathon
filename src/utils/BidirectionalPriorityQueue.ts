type QueueItem<T> = {
  item: T;
  priority: number;
};

export class BidirectionalPriorityQueue<T> {
  private items: QueueItem<T>[] = [];

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
  }

  dequeue(direction: "min" | "max"): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    let index = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (direction === "max") {
        if (this.items[i].priority > this.items[index].priority) {
          index = i;
        }
      } else {
        if (this.items[i].priority < this.items[index].priority) {
          index = i;
        }
      }
    }
    return this.items.splice(index, 1)[0];
  }

  peek(direction: "min" | "max"): QueueItem<T> | undefined {
    if (this.items.length === 0) return;
    if (direction === "max") {
      return this.items.reduce(
        (min, curr) => (curr.priority < min.priority ? curr : min),
        this.items[0]
      );
    } else {
      return this.items.reduce(
        (max, curr) => (curr.priority > max.priority ? curr : max),
        this.items[0]
      );
    }
  }

  getSize(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.getSize() === 0;
  }
}
