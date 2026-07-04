/** Event detail extended with the originating DOM event. */
export type WithOriginalEvent<
  T extends Record<string, unknown> = Record<string, never>,
> = T & {
  originalEvent?: Event;
};

export type OriginalEventDetail = {
  originalEvent?: Event;
};

export type ValueEventDetail<T = string> = {
  value: T;
};

export type ValueChangeEventDetail<T = string> = WithOriginalEvent<{
  value: T;
}>;

export type VisibleChangeEventDetail = WithOriginalEvent<{
  visible: boolean;
}>;

export type NodeEventDetail<TNode> = {
  node: TNode;
};

export type CheckedEventDetail = {
  checked: boolean;
};

export type CheckedValueEventDetail<TValue = string | boolean> = {
  checked: boolean;
  value: TValue;
};

export type IndexEventDetail = {
  index: number;
};

export type CommandEventDetail = {
  command: string;
};

export type ItemClickEventDetail<TItem> = WithOriginalEvent<{
  item: TItem;
}>;

export type FileEventDetail = WithOriginalEvent<{
  file?: File;
}>;
