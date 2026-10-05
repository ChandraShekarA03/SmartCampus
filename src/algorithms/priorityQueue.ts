/**
 * MinBinaryHeap Priority Queue for Dijkstra's Algorithm
 * Essential DAA Data Structure: Guarantees O(log V) extract-min and insert operations.
 */

export interface PQElement<T> {
  item: T;
  priority: number;
}

export class MinPriorityQueue<T> {
  private heap: PQElement<T>[] = [];
  public operationCount: number = 0;

  constructor() {
    this.heap = [];
    this.operationCount = 0;
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public insert(item: T, priority: number): void {
    this.operationCount++;
    const element: PQElement<T> = { item, priority };
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  public extractMin(): PQElement<T> | null {
    if (this.isEmpty()) return null;
    this.operationCount++;

    const min = this.heap[0];
    const end = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }

    return min;
  }

  public decreaseKey(itemMatcher: (item: T) => boolean, newPriority: number): boolean {
    this.operationCount++;
    const index = this.heap.findIndex(el => itemMatcher(el.item));
    if (index === -1) return false;

    if (newPriority < this.heap[index].priority) {
      this.heap[index].priority = newPriority;
      this.bubbleUp(index);
      return true;
    }
    return false;
  }

  public toArray(): Array<{ item: T; priority: number }> {
    return [...this.heap].sort((a, b) => a.priority - b.priority);
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      this.operationCount++;
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      if (element.priority >= parent.priority) break;

      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      this.operationCount++;
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex: number | null = null;

      if (leftChildIndex < length) {
        const leftChild = this.heap[leftChildIndex];
        if (leftChild.priority < element.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.heap[rightChildIndex];
        if (
          (swapIndex === null && rightChild.priority < element.priority) ||
          (swapIndex !== null && rightChild.priority < this.heap[leftChildIndex].priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;

      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = element;
      index = swapIndex;
    }
  }
}
