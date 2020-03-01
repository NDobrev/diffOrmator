import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box, AppBar } from '@material-ui/core';
import HexViewer from './HexViewer';
import Diff from './Diff';
import StartPanel from './StartPanel'
import FileManimulator from './FileManimulator'
import PossibleChangesList from './PossibleChangesList'
import { ADD_CHANGE, REMOVE_CHANGE } from './GlabalEvents'
import GlabalEventHandler from './GlabalEvents'
//import { connect } from 'react-redux';

window.GlabalEventHandler = new GlabalEventHandler();

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
    this.currentDiff = -1;
    this.state = {
      baseFiles: {
        file1: "00",
        file2: "00",
        diffs: [],
        ranges: [],
      },

      resultFiles: {
        file1: "00",
        file2: "00",
        diffs: [],
        ranges: [],
      },

      page: STARTING,
    };

    window.GlabalEventHandler.RigsterForEvent(ADD_CHANGE, (change) => {
     let resultFiles = {...this.state.resultFiles };
     let doneChanges = [...this.state.doneChanges ];
     doneChanges.push(change);

     resultFiles.file2 = FileManimulator.renderFileFromChanges(this.state.baseFiles.file2, resultFiles.file1.slice(0), doneChanges);
     this.setState({
        resultFiles: {
          file1: resultFiles.file1 ,
          file2: resultFiles.file2 ,
          ...FileManimulator.calculateDifferences( resultFiles.file1, resultFiles.file2),
          possibleChanges: resultFiles.possibleChanges,
        },
        doneChanges: doneChanges
      });
    })

    window.GlabalEventHandler.RigsterForEvent(REMOVE_CHANGE, (change) => {
     let resultFiles = {...this.state.resultFiles };
     let doneChanges = [...this.state.doneChanges ];
     let removeMe = doneChanges.findIndex(e => e.start == change.start );
     console.log(removeMe);
     doneChanges.splice(removeMe,1 );
     resultFiles.file2 = FileManimulator.renderFileFromChanges(this.state.baseFiles.file2, resultFiles.file1.slice(0), doneChanges);
     this.setState({
        resultFiles: {
          file1: resultFiles.file1 ,
          file2: resultFiles.file2 ,
          ...FileManimulator.calculateDifferences( resultFiles.file1, resultFiles.file2),
          possibleChanges: resultFiles.possibleChanges,
          marked: resultFiles.marked
        },
        doneChanges: doneChanges
      });
    })

  }

  componentDidMount() {
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


    SaveBlobAs(new Blob([this.state.resultFiles.file2]), "pesho.bin");
  }

 onStart(files) {
    (async () => {
      let f1 = new Uint8Array(await files.first.arrayBuffer());
      let f2 = new Uint8Array(await files.second.arrayBuffer());
      let t = new Uint8Array(await files.target.arrayBuffer());

      let diffs = FileManimulator.calculateDifferences( f1, f2);
      diffs.ranges = FileManimulator.calculatePossibleOffsets(f2, t, diffs.ranges );
      let doneChanges = diffs.ranges.filter((r)=> { return r.possibleOffsets.length == 1})
      .map((r) => {
        return {
          start: r.start,
          end: r.end,
          targetStart: r.possibleOffsets[0]
        }
      });

      let resultFile = FileManimulator.renderFileFromChanges(f2, t, doneChanges);
      console.log(diffs.ranges);
      let marked = diffs.ranges.map((e) => { 
          return [ ...e.possibleOffsets.map((p ) =>{
            return [...Array(e.end - e.start).keys()].map( i => p + i);
          })];
        }).flat(Infinity);
      console.log(marked);
      this.setState({
        page: DIFF,
        baseFiles: {
          file1: f1,
          file2: f2,
          ...diffs,
          marked: [],
        },
        
        resultFiles: {
          file1: t,
          file2: resultFile,
          ...FileManimulator.calculateDifferences( t, resultFile),
          possibleChanges: diffs.ranges,
          marked: marked
        },
        doneChanges: doneChanges,
      })
      
   })();
 }

  renderContent() {
    switch(this.state.page) {
      case STARTING:
        return (<StartPanel onready={this.onStart.bind(this)}> </StartPanel>)
      case DIFF:
        return (
          <div>
            <div className={this.styles.main}>
              <Diff info={this.state.resultFiles} regiseterForNavigation={true}></Diff>
              <Diff info={this.state.baseFiles} scrollPosition={this.state.scrollPosition}></Diff>
              
            </div>
            <PossibleChangesList changes={this.state.resultFiles.possibleChanges}/>
          </div>);
    }
  }

  render() {
    return (
      <div>
        {this.renderContent()}

      </div>

    );
  }
}

export default withStyles(styles)(App);

