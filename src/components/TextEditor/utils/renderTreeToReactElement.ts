import {HandleSelection, SelectedNode, Value} from "../types";
import {uuid} from "uuidv4";
import React, {ReactElement, SyntheticEvent} from "react";

export default function renderTreeToReactElement (value: Value, handleSelection: HandleSelection, selectedNode?: SelectedNode): ReactElement {
  const key = (value.props && value.props.key) || uuid();
  if (selectedNode) { selectedNode.key = key; }

  return React.createElement(
    value.component,
    {
      ...value.props,
      key,
      onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => handleSelection(ev, key)
    },
    renderChildren(value.children, handleSelection, selectedNode)
  );
}

function renderChildren(value: Value, handleSelection: HandleSelection, selectedNode?: SelectedNode) {
  if (!value) {
    return;
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(child => renderTreeToReactElement(child, handleSelection, selectedNode));
  }
  return renderTreeToReactElement(value, handleSelection, selectedNode);
}
