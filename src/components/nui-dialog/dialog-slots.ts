export function slotHasContent(slot: HTMLSlotElement): boolean {
  return slot.assignedElements({ flatten: true }).length > 0;
}
