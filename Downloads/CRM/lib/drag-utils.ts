export interface DragInfo {
  key: string;
  id: string;
}

export class DragManager {
  private dragInfo: DragInfo | null = null;

  onDragStart(key: string, id: string) {
    this.dragInfo = { key, id };
  }

  getDragInfo(): DragInfo | null {
    return this.dragInfo;
  }

  clearDragInfo() {
    this.dragInfo = null;
  }

  onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
}

export function createDragManager() {
  return new DragManager();
}
