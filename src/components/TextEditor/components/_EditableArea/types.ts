export interface EditorTree {
  component: string,
  props: {},
  children: EditorTree | [EditorTree] | string
}

