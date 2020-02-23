
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
    for(let i = 1; i < diffs.length; ++i) {
      if(diffs[i] - diffs[i - 1] > maxDiff ||  i + 1 == diffs.length) {
        ranges.push({
          start: diffs[currentStart],
          end: diffs[i-1],});
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
        for(let i = ch.start; i < ch.end; ++i) {
          let indexInTarget = ch.targetStart;
          console.log(indexInTarget)
          console.log(ch.start)
          let old = targetFile[indexInTarget];
          targetFile[indexInTarget] = from[i];
        }
    }
    return targetFile;
  }
}

export default FileManimulator