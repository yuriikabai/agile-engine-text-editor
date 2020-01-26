import React, {Component, ReactElement, KeyboardEvent, SyntheticEvent} from "react";
import {Theme, WithStyles, withStyles} from "@material-ui/core";

const styles = (theme: Theme) => ({
  contentEditable: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
  }
});

interface Props {
  value: ReactElement;
  onChange: (key: string) => void;
  handleSelection: (id: string, offset: number, text: string, focusOffset: number) => void;
  string: string;
}

class ContentEditableArea extends Component<WithStyles & Props> {
  elementRef = React.createRef<any>();

  handleChange = (ev: KeyboardEvent<any>) => {
    const { onChange } = this.props;
    onChange(ev.key);
  };

  shouldComponentUpdate(nextProps: Readonly<WithStyles & Props>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (!this.elementRef.current) {
      return true;
    }
    return nextProps.string !== this.elementRef.current.innerHTML;
  }

  componentDidUpdate() {
    if (!this.elementRef.current) return;
    const { string } = this.props;

    if (string !== this.elementRef.current.innerHTML) {
      this.elementRef.current.innerHTML = string;
    }
  }

  handleSelection = (ev: SyntheticEvent<any>) => {
    const selection = window.getSelection();

    if (selection && selection.anchorNode && selection.anchorNode.parentElement) {
      const id = selection.anchorNode.parentElement.id;
      // @ts-ignore
      const text = selection.anchorNode.wholeText;
      const offset = selection.anchorOffset;
      const focusOffset = selection.focusOffset;

      this.props.handleSelection(id, offset, text, focusOffset)
    }
  };

  render() {
    const { classes, value, string } = this.props;

    return (
      <div
        className={classes.contentEditable}
        contentEditable={true}
        onKeyUp={this.handleChange}
        ref={this.elementRef}
        onMouseUp={this.handleSelection}
        dangerouslySetInnerHTML={{ __html: string }}
      />
    );

    // return (
    //   <div
    //     className={classes.contentEditable}
    //     contentEditable={true}
    //     onKeyUp={this.handleChange}
    //     ref={this.elementRef}
    //   >{value}</div>
    // );
  }
}

export default withStyles(styles)(ContentEditableArea);
