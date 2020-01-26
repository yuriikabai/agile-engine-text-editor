import {SyntheticEvent} from "react";

export interface StyleProp {
  name: string;
  command: string;
  tag: string;
}

export type Value = any;

export type HandleSelection = (ev: SyntheticEvent<HTMLDivElement>, key: string) => void;

export interface SelectedNode {
  key?: string;
  offset?: number;
  text?: string;
}
