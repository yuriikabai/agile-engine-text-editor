import React, {Component, ReactElement, SyntheticEvent} from "react";
import {uuid} from "uuidv4";
import "./styles.css";
import ControlPanel from "../ControlPanel";

interface State {
  value: any;
}

class EditableArea extends Component<{}, State> {
  state = {
    value: {
      component: "span",
      props: {
        key: uuid(),
      },
      children: [
        {
          component: "b",
          props: {
            key: uuid(),
          },
          children: "hello "
        },
        {
          component: "i",
          props: {
            key: uuid(),
          },
          children: "world"
        }
      ]
    }
  };
  selectedNode?: { key: string; offset?: number; text?: string } = undefined;
  inputRef = React.createRef<HTMLInputElement>();
  selectionTimeout?: number;

  getChildren(children: any) {
    if (!children) {
      return;
    }
    if (typeof children === "string") {
      return children;
    }
    if (Array.isArray(children)) {
      return children.map(child => this.createElementFromValue(child));
    }
    return this.createElementFromValue(children);
  }

  createElementFromValue(value: any): ReactElement {
    const key = (value.props && value.props.key) || uuid();

    return React.createElement(
      value.component,
      {
        ...value.props,
        key,
        onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, key)
      },
      this.getChildren(value.children)
    );
  }

  getUpdateChangedNodeChildren(children: any, text: string): any {
    if (!children) {
      return;
    }
    if (typeof children === "string") {
      return children;
    }
    if (Array.isArray(children)) {
      return children.map(child => this.updateChangedNode(child, text));
    }
    return this.updateChangedNode(children, text);
  }

  getUpdatedValue(child: any, key: string) {
    if (key === "Enter") {
      const newKey = uuid();
      this.selectedNode = { key: newKey, offset: undefined };

      return [
        {
          component: child.component,
          props: child.props,
          children: child.children
        },
        {
          component: "br",
          props: {
            key: uuid()
          }
        },
        {
          component: "span",
          props: {
            key: newKey,
            onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, newKey)
          },
          "children": ""
        }
      ]
    }

    if (key === "Backspace") {
      return `${child.children.substring(0, child.children.length - 1)}`;
    }

    if (key === "Tab") {
      return `${child.children}    `;
    }

    if (key.length === 1) {
      return `${child.children}${key}`;
    }
  }

  updateChangedNode = (value: any, text: string) => {
    const isSelected = (this.selectedNode && this.selectedNode.key) === value.props.key;

    return {
      component: value.component,
      props: value.props,
      children: isSelected ? this.getUpdatedValue(value, text) : this.getUpdateChangedNodeChildren(value.children, text)
    }
  };

  handleInputChange = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({ value: this.updateChangedNode(this.state.value, ev.key) })
  };

  getInputToSelectionChildren = (children: any, key: string) => {
    const isSelected = (this.selectedNode && this.selectedNode.key) === key;

    if (isSelected) {
      const newKey = uuid();
      const newKey2 = uuid();
      const offset = (this.selectedNode && this.selectedNode.key) ? this.selectedNode.offset : undefined;
      this.selectedNode = { key: newKey, offset: undefined };

      return [
        {
          component: "span",
          props: {
            key: newKey,
            onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, newKey)
          },
          children: children.substring(0, offset)
        },
        {
          component: "input",
          props: {
            key: uuid(),
            onKeyDown: this.handleInputChange,
            ref: this.inputRef,
            value: ""
          }
        },
        {
          component: "span",
          props: {
            key: newKey2,
            onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, newKey2)
          },
          children: offset ? children.substring(offset, children.length) : null
        },
      ]
    }

    if (!children) {
      return null;
    }
    if (typeof children === "string") {
      return children;
    }
    if (Array.isArray(children)) {
      return children.map(child => this.setInputToSelection(child));
    }
    return this.setInputToSelection(children);
  };

  setInputToSelection = (value: any): any => {
    return {
      component: value.component,
      props: value.props,
      children: this.getInputToSelectionChildren(value.children, value.props.key)
    }
  };

  handleSelection = (ev: SyntheticEvent<HTMLElement>, key: string) => {
    ev.preventDefault();
    ev.stopPropagation();
    // @ts-ignore
    if (ev.target.tagName === "INPUT") { return; }
    const selection = window.getSelection();

    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
    }

    // @ts-ignore
    this.selectionTimeout = setTimeout(() => {
      this.selectedNode = {
        key,
        offset: selection ? selection.anchorOffset : undefined,
        // @ts-ignore
        text: (selection && selection.anchorNode) ? selection.anchorNode.wholeText : undefined
      };

      if (selection && selection.type === "Range") {
        return;
      }

      this.setState({ value: this.setInputToSelection(this.state.value) })
    }, 100);
  };

  getStyledChildren(value: any, selectedNode: any, style: string): any {
    if (!value.children) {
      return null;
    }
    if (typeof value.children === "string") {
      return value.children;
    }
    if (Array.isArray(value.children)) {
      return value.children.map((child: any) => this.changeStyle(child, selectedNode, style));
    }
    return this.changeStyle(value.children, selectedNode, style);
  }

  changeStyle(value: any, selectedNode: any, style: string): any {
    const isSelected = (this.selectedNode && this.selectedNode.key) === value.props.key;

    if (isSelected) {
      console.log("here");
      const offset = (this.selectedNode && this.selectedNode.offset) || 0;
      const text = (this.selectedNode && this.selectedNode.text) || "";
      const key = uuid();
      const key2 = uuid();

      return {
        component: offset === 0 ? style : value.component,
        props: value.props,
        children: offset === 0 ? value.children : [
          {
            component: "span",
            props: {
              key,
              onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, key)
            },
            children: text.substring(0, offset)
          },
          {
            component: style,
            props: {
              key2,
              onMouseUp: (ev: SyntheticEvent<HTMLDivElement>) => this.handleSelection(ev, key2)
            },
            children: text.substring(offset)
          },
        ]
      }
    }

    return {
      component: value.component,
      props: value.props,
      children: this.getStyledChildren(value, selectedNode, style)
    };
  }

  handleStyleClick = (style: string) => {
    console.log(style);
    console.log(this.selectedNode);
    this.changeStyle(this.state.value, this.selectedNode, style);
  };

  componentDidUpdate() {
    if (this.inputRef.current) {
      if (document.activeElement === this.inputRef.current) {
        return;
      }

      this.inputRef.current.focus();
    }
  }

  render() {
    const { value } = this.state;

    return (
      <>
        {/*<ControlPanel handleStyleClick={this.handleStyleClick} />*/}
        <div className="editable-area">
          {this.createElementFromValue(value)}
        </div>
      </>
    )
  }
}

export default EditableArea;
