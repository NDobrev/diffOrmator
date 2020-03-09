import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar, Paper, ButtonGroup} from '@material-ui/core';
import HexViewer from './HexViewer';
import { NAVIGATE_TO } from './GlabalEvents'

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
    this.styles = props.classes;
    this.currentDiff = -1;
    if (props.regiseterForNavigation) {
      window.GlabalEventHandler.RigsterForEvent(NAVIGATE_TO, (value)=>{
        this.updateScroll(value);
      });
    }

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
      this.setState({
      ...props.info,
        scrollPosition: props.scrollPosition ? props.scrollPosition : this.state.scrollPosition,
        marked: props.marked ? props.marked : this.state.marked,
      });
    }


  navigateToNextDiff() {
    if (!this.state.ranges.length) {
      return;
    }
    this.currentDiff = Math.min(++this.currentDiff, this.state.ranges.length -1);
    let offsetOfDiff = this.state.ranges[this.currentDiff].start;
    this.updateScroll(offsetOfDiff);
  }

  navigateToPrevDiff() {
    if (!this.state.ranges.length) {
      return;
    }
    this.currentDiff = Math.max(--this.currentDiff, 0);
    let offsetOfDiff = this.state.ranges[this.currentDiff].start;
    this.updateScroll(offsetOfDiff);
  }


  updateScroll(newValue) {
    this.setState({
      scrollPosition: Math.max(0, newValue - 24),
    })
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


    SaveBlobAs(new Blob([this.state.file2]), "pesho.bin");
  }
  render() {

    return (
        <Box className={this.styles.main} >
            <Box className={this.styles.half} border={1} borderRadius="borderRadius" borderColor="primary.main">
              <Box className={this.styles.diffFile}> 
                <HexViewer diffs={this.state.diffs}
                 marked={this.state.marked}
                file={this.state.file1}
                maxLines="10"
                scrollPosition={this.state.scrollPosition}
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
                <Button className={this.styles.button} onClick={ this.onSave.bind(this) }>
                  <img  className={this.styles.buttonIcon} src={require('./assets/save.png')}></img >
                </Button>
              </Box>
              <Box className={this.styles.diffFile}>
                <HexViewer diffs={this.state.diffs}
                marked={this.state.marked}
                file={this.state.file2}
                maxLines="10"
                scrollPosition={this.state.scrollPosition}
                onScrollUpdate={this.updateScroll.bind(this)}></HexViewer>
              </Box>
            </Box>
        </Box>
    );
  }
}

export default withStyles(styles)(Diff);

