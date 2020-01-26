import React, {PureComponent, SyntheticEvent} from "react";
import { withStyles, WithStyles, Theme, Grid, Paper, Button, ButtonGroup } from "@material-ui/core";
import {StyleProp} from "../../types";

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    position: "relative" as "relative",
    zIndex: 1
  }
});

interface Props {
  handleStyleClick: (property: StyleProp) => void;
  stylesConfig: StyleProp[]
}

class ControlPanel extends PureComponent<Props & WithStyles> {
  handleStyleClick = (ev: SyntheticEvent<HTMLButtonElement>, styleProperty: StyleProp) => {
    ev.preventDefault();
    const { handleStyleClick } = this.props;
    handleStyleClick(styleProperty);
  };

  render() {
    const { classes, stylesConfig } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ButtonGroup size="small" color="primary" aria-label="small outlined primary button group">
              {stylesConfig.map((styleProperty: StyleProp) => (
                <Button
                  key={styleProperty.command}
                  onMouseDown={(ev) => this.handleStyleClick(ev, styleProperty)}
                >
                  {styleProperty.name}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>

        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(ControlPanel);
