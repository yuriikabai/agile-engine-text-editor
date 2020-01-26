import React, {Component} from "react";
import {Container, Paper} from "@material-ui/core";
import ControlPanel from "./components/ControlPanel";
import ContentEditableArea from "./components/ContentEditableArea";
import {HandleSelection, SelectedNode, StyleProp, Value} from "./types";
import renderTreeToReactElement from "./utils/renderTreeToReactElement";
import {renderToString} from "react-dom/server";
import updateTreeWithInput from "./utils/updateTreeWithInput";
import restyleTree from "./utils/restyleTree";

interface State {
  value: Value
}

class TextEditor extends Component<{}, State> {
  stylesConfig: StyleProp[] = [
    { name: "b", command: "bold", tag: "b" },
    { name: "i", command: "italic", tag: "i" },
    { name: "u", command: "underline", tag: "u" }
  ];
  selectedNode: SelectedNode = { key: undefined };

  state = {
    value: {
      component: "span",
      props: {
        id: "1",
        key: "1",
      },
      children: [
        {
          component: "b",
          props: {
            id: "2",
            key: "2",
          },
          children: "Hello. Requirements look similar to what the grammarly editor is. "
        },
        {
          component: "i",
          props: {
            id: "3",
            key: "3",
          },
          children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }
      ]
    }
  };

  handleStyleClick = (styleProperty: StyleProp) => {
    const { value } = this.state;
    const selection = window.getSelection();

    // document.execCommand(styleProperty.command, false);

    const restyledValue = restyleTree(value, styleProperty, selection, this.selectedNode);
    this.setState({ value: restyledValue });
  };

  handleChange = (key: string) => {
    const value = updateTreeWithInput(this.state.value, this.selectedNode, key, this.handleSelection);
    this.setState({ value });
  };

  handleSelection: HandleSelection = (ev, key) => {
    ev.preventDefault();
    ev.stopPropagation();
    const selection = window.getSelection();
    const offset = selection ? selection.anchorOffset : undefined;
    // @ts-ignore
    const text = (selection && selection.anchorNode) ? selection.anchorNode.wholeText : undefined;

    this.selectedNode = { key, offset, text };
  };

  handleWrapperSelection = (id: string, offset: number, text: string, focusOffset: number) => {
    this.selectedNode = { key: id, offset, text };
  };

  render() {
    const { value } = this.state;
    const tree = renderTreeToReactElement(value, this.handleSelection, !this.selectedNode.key ? this.selectedNode : undefined);
    const treeString = renderToString(tree).replace(" data-reactroot=\"\"", "");

    return (
      <Container>
        <ControlPanel
          stylesConfig={this.stylesConfig}
          handleStyleClick={this.handleStyleClick}
        />
        <Paper>
          <ContentEditableArea value={tree} string={treeString} onChange={this.handleChange} handleSelection={this.handleWrapperSelection} />
        </Paper>
      </Container>
    );
  }
}

export default TextEditor;
