
class FileManimulator
{
    static findPossiblePositionst(file, target, start, minNumberOfBytes = 4, maxNumberOfBytes = 1000) {

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
          if(start - currentBytesCount <= 0) {
            break;
          }
        }
      result = result.map((v => v + currentBytesCount));
      return {possibleOffsets: result, numberOfSameBytes : currentBytesCount};
    }

    static calculateDifferences(file1, file2, targetFile) {

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
    if(diffs.length == 1) {
      ranges.push({
          start: diffs[currentStart],
          end: diffs[currentStart] + 1 });
    }

    for(let i = 1; i < diffs.length; ++i) {
      if(diffs[i] - diffs[i - 1] > maxDiff ||  i + 1 == diffs.length) {
        ranges.push({
          start: diffs[currentStart],
          end: diffs[i-1] + 1,});
        currentStart = i;
      }
    }

    return {
      diffs: diffs,
      ranges: ranges
    };
  }

 static calculatePossibleOffsets(file, targetFile, ranges) {
    return ranges.map( range => {
      return { ...range,
               ...FileManimulator.findPossiblePositionst(file, targetFile, range.start)
      };
    });
  }

  static renderFileFromChanges(from, to, changes) {
    let targetFile = new Uint8Array(to);
    for(let ch of changes) {
        let indexInTarget = ch.targetStart;
        let numberOfBytesToChange = ch.end - ch.start;
        for(let i = 0; i < numberOfBytesToChange; ++i) {
          
          let old = targetFile[indexInTarget + i];
          if (old!= from[ch.start + i]) {
            //console.log(`changed byte at: ${indexInTarget + i} from ${old} to ${from[ch.start + i]}`);
          }
          targetFile[indexInTarget + i] = from[ch.start + i];
        }
    }
    return targetFile;
  }
}

export default FileManimulator