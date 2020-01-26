import {HandleSelection, SelectedNode, Value} from "../types";
import {uuid} from "uuidv4";
import {SyntheticEvent} from "react";

export default function updateTreeWithInput(value: Value, selectedNode: SelectedNode, key: string, handleSelection: HandleSelection) {
  const isSelected = value.props.key.toString() === (selectedNode.key && selectedNode.key.toString());

  return {
    component: value.component,
    props: value.props,
    children: isSelected
      ? getUpdatedValueWithInput(value, selectedNode, key, handleSelection)
      : getTreeChildren(value.children, selectedNode, key, handleSelection)
  }
}

function getUpdatedValueWithInput(child: Value, selectedNode: SelectedNode, key: string, handleSelection: HandleSelection) {
  if (key === "Enter") {
    const newKey = uuid();
    selectedNode = { key: newKey, offset: 0, text: "" };
    const brKey = uuid();

    return [
      {
        component: child.component,
        props: child.props,
        children: child.children
      },
      {
        component: "br",
        props: {
          key: brKey,
          id: brKey
        }
      },
      {
        component: "p",
        props: {
          key: newKey,
          id: newKey,
          onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => handleSelection(ev, newKey)
        },
        "children": ""
      }
    ]
  }

  if (key === "Backspace") {
    return child.children ? `${child.children.substring(0, child.children.length - 1)}` : child.children;
  }

  if (key === "Tab") {
    return `${child.children}    `;
  }

  if (key.length === 1) {
    return child.children ? child.children.substring(0, selectedNode.offset) + key + child.children.substring(selectedNode.offset) : child.children;
    // return `${child.children.substring(0, selectedNode.offset)}` `${child.children}${key}`;
  }

  return child.children;
}

function getTreeChildren(value: Value, selectedNode: SelectedNode, key: string, handleSelection: HandleSelection): undefined | string | Array<Value> | Value {
  if (!value) {
    return;
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(child => updateTreeWithInput(child, selectedNode, key, handleSelection));
  }
  return updateTreeWithInput(value, selectedNode, key, handleSelection);
}
