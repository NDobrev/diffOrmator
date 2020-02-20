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


class App extends React.Component {
  constructor(props) {
    super();
    this.styles = props.classes;
    this.currentDiff = 0;
    this.state = {
      file1: "00",
      file2: "00",
      targetFile: "00",
      scrollPosition: 0,
      diffs: [],
      ranges: [],
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

  findPossiblePositionst(file, target, start, minNumberOfBytes = 4, maxNumberOfBytes = 1000) {

    let executeSingleIteration = (array, target) => {
      let result = [];
      for (let i = 0; i < target.length - array.length; ++i) {
        let same = true;
        for(let j = 0; j < array.length; j++) {
          if(target[i + j] != array[j]) {
            same = false;
            break;
          }
        }
        if (same) {
          result.push(i);
        }
      }
      return result;
    }

    let result = [];
    let currentBytesCount = minNumberOfBytes;
    for(; currentBytesCount < maxNumberOfBytes; ++currentBytesCount) {
      let array = file.slice(start - currentBytesCount, start);

      let r = executeSingleIteration(array, target);
      if (r.length == 0) {
        break;
      }
      if (r.length == 1) {
        result = r;
        break;
      }
      result = r;
    }
    return {posibleOffsets: result, numberOfSameBytes : currentBytesCount};
  }

  calculateDifferences() {
    let file1 = new Uint8Array(this.state.file1);
    let file2 = new Uint8Array(this.state.file2);
    let targetFile = new Uint8Array(this.state.targetFile);

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

   if(targetFile == "00" || file1.length  != targetFile.length) {
      return;
    }

    ranges = ranges.map( range => {
      return {...range
              , ...this.findPossiblePositionst(file1, targetFile, range.start)
      };
    });

    this.setState({
      diffs: diffs,
      ranges: ranges,
    })
    console.log(ranges);
  }

  onSave(ev) {

    function SaveBlobAs(blob, file_name) {  
        console.log(`Save file with size ${blob.size}`)
        var saver = document.createElement("a");
        var blobURL = saver.href = URL.createObjectURL(blob);
        let body = document.body;
    
        saver.download = file_name;
        body.appendChild(saver);
        saver.dispatchEvent(new MouseEvent("click"));
        body.removeChild(saver);
        URL.revokeObjectURL(blobURL);
    }

    let targetFile = new Uint8Array(this.state.targetFile);
    console.log(`Target file size ${targetFile.length}`)
    let ranges = this.state.ranges;
    for(let r of ranges) {
      if(r.posibleOffsets.length == 1) {
        let offset = r.posibleOffsets[0];
        for(let i = r.start; i < r.end; ++i) {
          let indexInTarget = offset + i - r.start;
          let old = targetFile[indexInTarget];
          targetFile[indexInTarget] = this.state.file2[i];
          console.log(`Change ${old} to ${targetFile[indexInTarget]}`);
        }
      }
      else {
       console.log(`Not solved: ${JSON.stringify(r)}`);
      }
    }
    SaveBlobAs(new Blob([targetFile]), "pesho.bin");
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

  loadTargetFile(files) {
    if(files.length == 1) {
      files[0].arrayBuffer().then(text => this.setState({
        targetFile: text
      }, () => {
        this.calculateDifferences();
        })
      );
    }
  }
  loadFile1(files) {
    if(files.length == 1) {
      files[0].arrayBuffer().then(text => this.setState({
        file1: text
      }, () => {
        this.calculateDifferences();
        })
      );
    }
  }
  loadFile2(files) {
    if(files.length == 1) {
      files[0].arrayBuffer().then(text => this.setState({
        file2: text
      },  () => {
        this.calculateDifferences();
        })
      );
    }
  }

  updateScroll(newValue) {
    console.log(newValue);
    this.setState({
      scrollPosition: newValue,
    })
  }
  render() {
    return (
        <Box className={this.styles.main}>
          <Button variant="contained" color="primary" onClick={this.onSave.bind(this)}>
            Save As
          </Button>
          <Box className={this.styles.half}>
            <HexViewer file={this.state.targetFile}
            maxLines="20"
            scrollPosition={this.state.scrollPosition}
            onLoadFile={this.loadTargetFile.bind(this)}
            onScrollUpdate={this.updateScroll.bind(this)}
            ></HexViewer>
          </Box>
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

