import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, Checkbox, Divider } from '@material-ui/core';
import { NAVIGATE_TO, ADD_CHANGE, REMOVE_CHANGE } from './GlabalEvents'
import GotoIcon from './assets/goto.png'; 

const styles = {
  root: {
    overflow: 'auto',
    maxHeight: "300px",
    width: "750px"
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
      changes: props.changes.map((value) => {
        return {
          ...value,
          entries: value.possibleOffsets.map((v) => {
             return {offset: v, checked: value.possibleOffsets.length == 1};
          })
        }
      }),
    }
  }

  handleChange(rangeIndex, offsetIndex, value) {
    return (ev) =>{
      let changes = this.state.changes;
      changes[rangeIndex].entries[offsetIndex].checked = ev.target.checked;
      this.setState({
        changes: changes
      });

      if(ev.target.checked) {
        window.GlabalEventHandler.FireEvent(ADD_CHANGE, {
          start: value.start,
          end: value.end,
          targetStart: value.possibleOffsets[offsetIndex]
        });
      }
      else {
        window.GlabalEventHandler.FireEvent(REMOVE_CHANGE, {
          start: value.start,
          end: value.end,
          targetStart: value.possibleOffsets[offsetIndex]
        });
      }
    }
  }

  navigateTo(rangeIndex, offsetIndex) {
    return () => {
      let offset = this.state.changes[rangeIndex].entries[offsetIndex].offset;
      window.GlabalEventHandler.FireEvent(NAVIGATE_TO, offset);
    }
  }

  renderEntry(value, rangeIndex) {
    return (
      <List className={this.styles.noPadding}>
          {
            value.entries.map((entry , index) => { 
              return (<ListItem  key={index} className={this.styles.noPadding}>
                <Checkbox
                        edge="start"
                        checked={entry.checked}
                        tabIndex={-1}
                        disableRipple
                        onChange={this.handleChange(rangeIndex, index, value)}
                      />
                {`target offset: ${d2h(entry.offset)}, similarity: ${value.numberOfSameBytes} `}
                <img  className={this.styles.goto} src={require('./assets/goto.png')}
                onClick={this.navigateTo(rangeIndex, index)} ></img >
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
                    [
                    <ListItem key={index} className={this.styles.noPadding}>
                      
                      {`start offset: ${d2h(value.start)}, end offset: ${d2h(value.end)}`}
                      {this.renderEntry(value, index)}

                    </ListItem>,
                    <Divider/>
                    ]
                )
            })}
        </List>
    );
  }
}

export default withStyles(styles)(PossibleChangesList);

