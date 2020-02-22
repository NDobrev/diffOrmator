import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, Checkbox } from '@material-ui/core';

import GotoIcon from './assets/goto.png'; 

const styles = {
  root: {
    overflow: 'auto',
    maxHeight: "300px",
    width: "500px"
  },

  goto: {
    marginLeft: "10px",
    width: "20px",
    height: "20px",
  },
  noPadding: {
    paddingTop: "0px",
    paddingBottom: "0px",
  }
};

function d2h(d) {
    var hex = Number(d).toString(16);
    hex = "0x0000000000".substr(0, 10 - hex.length) + hex;
    return hex;
  }


class PossibleChangesList extends React.Component {
  constructor(props) {
    super();
    this.styles = props.classes;
    console.log(props.changes)
    this.state = {
      changes: props.changes
    }
  }

  renderEntry(value) {
    return (
      <List className={this.styles.noPadding}>
          {
            value.possibleOffsets.map((possibleOffset , index) => { 
              return (<ListItem className={this.styles.noPadding}>
                <Checkbox
                        edge="start"
                        checked={Math.random() > 0.5}
                        tabIndex={-1}
                        disableRipple
                      />
                {`${d2h(possibleOffset)}`}
                <img  className={this.styles.goto} src={require('./assets/goto.png')}></img >
              </ListItem>)
          })}
      </List>

    )
  }

  render() {
    return (
        <List className={this.styles.root}>
            {this.state.changes.map((value , index) => { 
                return (
                    <ListItem className={this.styles.noPadding}>
                      
                      {`${d2h(value.start)}, ${d2h(value.end)}`}
                      {this.renderEntry(value)}

                    </ListItem>
                )
            })}
        </List>
    );
  }
}

export default withStyles(styles)(PossibleChangesList);

