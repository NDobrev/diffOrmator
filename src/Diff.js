import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar, Paper, ButtonGroup} from '@material-ui/core';
import HexViewer from './HexViewer';
const styles = {
  main: {
    flexGrow: 0,
    flexShrink: 0,
    width: "650px",
    display: "flex",
    padding: "25px 5px 5px 25px"
  },

  half: {
    width: "100%",
    minWidth: "500px",
  },
  diffFile: {
    flexGrow: 0,
    display: "flex",

  },
  bar: {
    height: "20px",
  },
  buttonIcon: {
    width: "20px",
    height: "20px"
  },
  button: {
    flexGrow: 1,
    display: "flex",
  },
  buttonGroup: {
    display: "flex",
  }
};


class Diff extends React.Component {
  constructor(props) {
    super();
    console.log(props);
    this.styles = props.classes;
    this.currentDiff = 0;
    this.state = {
      ...props.info,
      scrollPosition: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 39) {
        this.navigateToNextDiff();
      }
      if (ev.keyCode == 37) {
        this.navigateToPrevDiff();
      }
    });
  }

  componentWillReceiveProps(props) {
      console.log(props);
      this.setState({
      ...props.info,
      scrollPosition: 0,
      });
    }


  navigateToNextDiff() {

    this.currentDiff = Math.min(++this.currentDiff, this.state.ranges.length -1);
    let offsetOfDiff = this.state.ranges[this.currentDiff].start;
    this.setState({
      scrollPosition: offsetOfDiff,
    }) 
  }

  navigateToPrevDiff() {
    this.currentDiff = Math.max(--this.currentDiff, 0);
    let offsetOfDiff = this.state.ranges[this.currentDiff].start;
    this.setState({
      scrollPosition: offsetOfDiff,
    })
   
  }


  updateScroll(newValue) {
    this.setState({
      scrollPosition: newValue,
    })
  }
  render() {
    return (
        <Box className={this.styles.main} >
            <Box className={this.styles.half} border={1} borderRadius="borderRadius" borderColor="primary.main">
              <Box className={this.styles.diffFile}> 
                <HexViewer diffs={this.state.diffs}
                file={this.state.file1}
                maxLines="10"
                scrollPosition={this.state.scrollPosition}
                onLoadFile={ () => {}}
                onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
              </Box>
              <Box  className={this.styles.buttonGroup}
                borderTop={1}
                borderBottom={1}
                borderColor="primary.main">
                  <Button className={this.styles.button} onClick={ this.navigateToPrevDiff.bind(this) }>
                  <img  className={this.styles.buttonIcon} src={require('./assets/left_arrow.png')}></img >
                </Button>
                <Button className={this.styles.button} onClick={ this.navigateToNextDiff.bind(this) }>
                  <img  className={this.styles.buttonIcon} src={require('./assets/right_arrow.png')}></img >
                </Button>
                <Button className={this.styles.button}>
                  <img  className={this.styles.buttonIcon} src={require('./assets/save.png')}></img >
                </Button>
              </Box>
              <Box className={this.styles.diffFile}>
                <HexViewer diffs={this.state.diffs}
                file={this.state.file2}
                maxLines="10"
                scrollPosition={this.state.scrollPosition}
                onLoadFile={ () => {}}
                onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
              </Box>
            </Box>
        </Box>
    );
  }
}

export default withStyles(styles)(Diff);

