import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup, Paper, Icon } from '@material-ui/core';



import UploadIcon from './assets/up_load.png'; 

const styles = {
  main: {
    position: "absolute",
    top: "20%",
    left: "20%",
    display: "flex",
    flexDirection: "column",
    color: "text.primary"
  },
  button: {
    width: "250px",
    overflow: "hidden"
  },
  fileUpload: {
    marginLeft: "10px",
    width: "20px",
    height: "20px",
    backgroundImage: `url(${UploadIcon})`
  }
};


class StartPanel extends React.Component {
  constructor(props) {
    super();
    this.styles = props.classes;
    this.onready = props.onready;
    this.state = {
      firstName : "Upload first File",
      secondName : "Upload second File",
      targetName : "Upload target File",
      firstFile : null,
      secondFile : null,
      targetFile : null,
      ready: false,
    }
  }

  onLoadFirstFile(files) {
    this.setState ({
      firstName: files[0].name,
      firstFile: files[0]
    }, ()=> {this.checkIfReady()});
  }

  onLoadSecondFile(files) {
    this.setState ({
      secondName: files[0].name,
      secondFile: files[0]
    }, ()=> {this.checkIfReady()});
  }

  onLoadTargetFile(files) {
    this.setState ({
      targetName: files[0].name,
      targetFile: files[0]
    }, ()=> {this.checkIfReady()});
  }

  checkIfReady() {
    if (!this.state.firstFile || !this.state.secondFile || !this.state.targetFile ||
          this.state.firstFile.size != this.state.secondFile.size
          || this.state.firstFile.size != this.state.targetFile.size) {
      this.setState({
        ready: false
      });
      return;
    }
    this.setState({
      ready: true
    });
  }

  onStart() {
    this.onready({
      first: this.state.firstFile,
      second: this.state.secondFile,
      target: this.state.targetFile,
    })
  }

  render() {
    return (
      <Paper elevation={3} className={this.styles.main}>
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
          <Button component="label"  >
            <div className={this.styles.button}>
            {this.state.firstName}
            </div>
            <input
                type="file"
                style={{ display: "none" }}
                onChange={ (e) => this.onLoadFirstFile(e.target.files) }
            />
          <img  className={this.styles.fileUpload} src={require('./assets/up_load.png')}></img >
          </Button>

          <Button component="label">
            <div className={this.styles.button}>
            {this.state.secondName}
            </div>
            <input
                type="file"
                style={{ display: "none" }}
                onChange={ (e) => this.onLoadSecondFile(e.target.files) }
            />
            <img  className={this.styles.fileUpload} src={require('./assets/up_load.png')}></img >
          </Button>
          <Button component="label">
              <div className={this.styles.button}>
             {this.state.targetName}
             </div>
            <input
                type="file"
                style={{ display: "none" }}
                onChange={ (e) => this.onLoadTargetFile(e.target.files) }
            />
            <img  className={this.styles.fileUpload} src={require('./assets/up_load.png')}></img >
          </Button>
                  
        </ButtonGroup>
        <Button disabled={!this.state.ready} onClick={this.onStart.bind(this)}> Start</Button>
      </Paper>
    );
  }
}

export default withStyles(styles)(StartPanel);

