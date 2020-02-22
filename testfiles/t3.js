import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar } from '@material-ui/core';
import HexViewer from './HexViewer';

const styles = {
  main: {
    flexGrow: 1,
    width: "100%",
    height: "50%",
    display: "flex",
    color: "text.primary"
  },
  bar: {
      height: "20px",
      minHeight: "20px",
  },
  half: {
    width: "100%",
    minWidth: "500px",
  },
  diffFile: {
    flexGrow: 0,
    display: "flex",
    height: "45%",
    width: "90%",
    marginLeft: "5%",
  },
  verticalSpliter: {
    flexGrow: 0,
    display: "flex",
    height: "10%",
    width: "90%",
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
        <Box className={this.styles.main}>
          <Box className={this.styles.half}>
            <Box className={this.styles.diffFile}> 
              <HexViewer diffs={this.state.diffs}
              file={this.state.file1}
              maxLines="10"
              scrollPosition={this.state.scrollPosition}
              onLoadFile={ () => {}}
              onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
            </Box>
            <Box className={this.styles.verticalSpliter}></Box>
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

