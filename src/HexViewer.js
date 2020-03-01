import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Box, Divider, Slider,AppBar,Toolbar, Button  } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const numberOfBytesPerLine = 12;
const styles = {


  main: {
    width: "100%",
  },
  fileUpload: {
    padding: "0px"
  },
  bar: {
      height: "20px",
      minHeight: "20px",
  },
  devider: {
      width: "20px",
  },
  addressCol: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: "0",
    flexShrink: "0",
    overflow: "hidden",
    width: "100px",
  },
  addressBox: {
    width: "100%",
    height: "20px",
    overflow: "hidden"
  },
  hex: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: "0",
    flexShrink: "0",
    overflow: "hidden",
    width: numberOfBytesPerLine * 20 + "px",
  },
  value: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: "0",
    flexShrink: "0",
    overflow: "hidden",
    flexBasis: numberOfBytesPerLine * 20 + "px",
  },
  byte: {
    width: "20px",
    height: "20px",
    overflow: "hidden",
    flexWrap: "wrap",
    flexGrow: "0",
    flexShrink: "0",
  },
  diff: {
    backgroundColor: "red",
  },
  marked: {
    backgroundColor: "rgba(255,165,0, 125)",
  }
}

function buf2txt(buffer) { // buffer is an ArrayBuffer
    return String.fromCharCode(...new Uint8Array(buffer)).split("");
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function decimalToHex(d) {
    var hex = Number(d).toString(16);
    hex = "0x0000000000".substr(0, 10 - hex.length) + hex;
    return hex;
  }

class HexViewer extends Component {
    constructor(props) {
        super();
        this.styles = props.classes;
        this.onScrollUpdate = props.onScrollUpdate;
        this.state = this.renderState(props);
    }

    renderState(props) {
        let newState = {
            file: props.file,
            currentStart: Math.floor(props.scrollPosition / numberOfBytesPerLine) * numberOfBytesPerLine,
            diffs: props.diffs ? props.diffs : [],
            marked: props.marked ? props.marked : [1,2,4],
            numberOfLines: (Math.floor(props.file.byteLength /numberOfBytesPerLine) + 1),
            maxLines: props.maxLines ? props.maxLines : 25,
        };
        return {
            ...newState,
            ...this.generateContentContent(newState.currentStart, newState.file, newState.maxLines)
        }
    }

    componentWillReceiveProps(props) {
        this.setState(this.renderState(props));
    }

    generateContentContent(currentStart, file, maxLines) {

        var MaxOffsetInPage = currentStart + numberOfBytesPerLine * maxLines;

        if (file.byteLength < MaxOffsetInPage) {
            MaxOffsetInPage = file.byteLength;
        }
        
        let content = file.slice(currentStart, MaxOffsetInPage);
        if(!content.byteLength) {
            return;
        }
        const bytes = buf2hex(content).match(/.{1,2}/g);
        const offsets = [];
        for(let i = currentStart; i < MaxOffsetInPage; i+=numberOfBytesPerLine) {
            offsets.push(decimalToHex(i));
        }
        return {
            bytes: bytes,
            offsets: offsets,
            values: buf2txt(content),
        };
    }

    styleByte(localOffset) {
        let realOffset = this.state.currentStart + localOffset;
        let found = this.state.diffs.find(element => element == realOffset);
        if (found) {
             return this.styles.diff;
        }
        found = this.state.marked.find(element => element == realOffset);
        if (found) {
             return this.styles.marked;
        }
        return "";
    }

    isMarked(localOffset) {
        let realOffset = this.state.currentStart + localOffset;
        
        return "";
    }

    render() {
        return (
            <div  className={this.styles.main}>
                <Box display="flex" flexGrow="1">
                    <Box className={this.styles.addressCol}>
                        {this.state.offsets.map((offset, i) =>  <span  key={i} className={this.styles.addressBox}>{offset}</span>)}
                    </Box>
                    <Divider orientation="vertical" className={this.styles.devider} />
                    <Box className={this.styles.hex} >
                        {this.state.bytes.map(
                            (byte, offset) =>  
                            <span key={offset} id={this.state.currentStart +  offset}
                            className={this.styles.byte + " " + this.styleByte(offset)}>
                                {byte}
                                </span>)}
                    </Box>
                    <Divider orientation="vertical" className={this.styles.devider} />
                    <Box className={this.styles.value} >
                        {this.state.values.map((value, i) =>  <span key={i} className={this.styles.byte}>{value}</span>)}
                    </Box>
                </Box>
            </div>
        );
    }
}

export default withStyles(styles)(HexViewer);