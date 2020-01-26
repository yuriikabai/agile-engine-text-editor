import {SelectedNode, StyleProp, Value} from "../types";
import {uuid} from "uuidv4";

export default function restyleTree(value: Value, styleProp: StyleProp, selection: Selection | null, selectedNode: SelectedNode) {

  // @ts-ignore
  if (!selection || !selection.anchorNode || !selection.anchorNode.parentElement || !selection.anchorNode.wholeText) {
    return value;
  }

  const { id } = selection.anchorNode.parentElement;
  // @ts-ignore
  const wholeText = selection.anchorNode.wholeText;
  const anchorOffset = selection.anchorOffset;
  const focusOffset = selection.focusOffset;

  const startText = wholeText.substring(0, anchorOffset);
  const text = wholeText.substring(anchorOffset, focusOffset);
  const endText = wholeText.substring(focusOffset);

  return updateTreeWithStyles(value, id, styleProp, [startText, text, endText], selectedNode);
}

function updateTreeWithStyles(value: Value, id: string, styleProp: StyleProp, texts: [string, string, string], selectedNode: SelectedNode): Value {
  const isSelected = value && value.props && value.props.key && value.props.key.toString() === id;

  if (isSelected) {
    const prevKey = uuid();
    const key = uuid();
    const nextKey = uuid();
    const [prevText, text, nextText] = texts;
    selectedNode = { key, text, offset: text.length };

    return {
      component: value.component,
      props: value.props,
      children: [
        {
          component: "span",
          props: {
            id: prevKey,
            key: prevKey
          },
          children: prevText
        },
        {
          component: styleProp.tag,
          props: {
            key: key,
            id: key
          },
          children: text
        },
        {
          component: "span",
          props: {
            id: nextKey,
            key: nextKey
          },
          children: nextText
        },
      ]
    }
  }

  if (!value) {
    return;
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(child => updateTreeWithStyles(child, id, styleProp, texts, selectedNode));
  }
  return {
    component: value.component,
    props: value.props,
    children: updateTreeWithStyles(value.children, id, styleProp, texts, selectedNode)
  }
  // return updateTreeWithStyles(value, id, styleProp, texts, selectedNode);
}
