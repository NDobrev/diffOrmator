import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar } from '@material-ui/core';
import HexViewer from './HexViewer';
import Diff from './Diff';
import StartPanel from './StartPanel'
import FileManimulator from './FileManimulator'
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

const STARTING = 1;
const DIFF =2;

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
      page: STARTING,
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

 onStart(files) {
   (async () => {
    let result = FileManimulator.calculateDifferences(
      new Uint8Array(await files.first.arrayBuffer()),
      new Uint8Array(await files.second.arrayBuffer()),
      new Uint8Array(await files.target.arrayBuffer()),
    )
    this.setState({
      page: DIFF
    })
    console.log(result);
   })();
 }

  updateScroll(newValue) {
    console.log(newValue);
    this.setState({
      scrollPosition: newValue,
    })
  }

  renderContent() {
    switch(this.state.page) {
      case STARTING:
        return (<StartPanel onready={this.onStart.bind(this)}> </StartPanel>)
      case DIFF:
        return (<div></div>);
    }
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
        /*<Box className={this.styles.main}>
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
        </Box>*/
    );
  }
}

export default withStyles(styles)(App);

