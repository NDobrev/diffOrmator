import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar } from '@material-ui/core';
import HexViewer from './HexViewer';
//import { connect } from 'react-redux';

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
    this.styles = props.classes;
    this.currentDiff = 0;
    this.state = {
      file1: "00",
      file2: "00",
      scrollPosition: 0,
      diffs: [],
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

  calculateDifferences() {
    let file1 = new Uint8Array(this.state.file1);
    let file2 = new Uint8Array(this.state.file2);
   
    if(this.state.file1 == "00" || this.state.file2 == "00") {
      return;
    }

    if (file1.length != file2.length) {
      return;
    }
    let diffs = [];
    for(let i = 0; i < file1.byteLength; ++i) {
      if (file1[i] != file2[i]) {
        diffs.push(i);
      }
    }


    let ranges = [];
    let currentStart = 0;
    let maxDiff = 20;
    let numberOfBytesBefore = maxDiff;
    for(let i = 1; i < diffs.length; ++i) {
      if(diffs[i] - diffs[i - 1] > maxDiff ||  i + 1 == diffs.length) {
        ranges.push({
          start: diffs[currentStart],
          end: diffs[i-1],});
        currentStart = i;
      }
    }
    this.setState({
      diffs: diffs,
      ranges: ranges,
    }, () => {
      this.navigateToPrevDiff();
    })
  }

  componentWillReceiveProps(props) {
        this.setState({
            file1: props.file1,
            file2: props.file2,
            scrollPosition: 0,
            diffs: [] },
            () => {
                this.calculateDifferences();
            }
        );
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
              onLoadFile={this.loadFile1.bind(this)}
              onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
            </Box>
            <Box className={this.styles.verticalSpliter}></Box>
            <Box className={this.styles.diffFile}>
              <HexViewer diffs={this.state.diffs}
              file={this.state.file2}
              maxLines="10"
              scrollPosition={this.state.scrollPosition}
              onLoadFile={this.loadFile2.bind(this)}
              onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
            </Box>
        </Box>
        </Box>
    );
  }
}

export default withStyles(styles)(App);

