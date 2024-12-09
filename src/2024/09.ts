type Block = { fileId?: number, free: boolean }
type Disk = Block[];

export default function runSolution(fileInput: string): void {
  var theDisk = parseDiskIntoBlocks(fileInput);
  fragmentDisk(theDisk); // part one

  var diskPartTwo = parseDiskIntoBlocks(fileInput);
  defragmentDisk(diskPartTwo); // part two
}

function fragmentDisk(disk: Disk) {
  // initialize pointers
  var nextFreeSpace = disk.findIndex((it) => it.free);
  var nextFileBlock = disk.length - 1;
  // scan back to next file
  while (disk[nextFileBlock].free) {
    nextFileBlock--;
  }

  while (nextFileBlock > nextFreeSpace) {
    // swap blocks at pointers
    moveBlock(disk, nextFileBlock, nextFreeSpace);

    // update pointers
    while (disk[nextFileBlock].free) {
      nextFileBlock--;
    }
    while (!disk[nextFreeSpace].free) {
      nextFreeSpace++;
    }
  }

  // now calculate the checksum
  var checksum = checksumDisk(disk);
  console.log(`The checksum after de-defragmenting is ${checksum}`);
}

function checksumDisk(disk: Disk): number {
  return disk.reduce((sum: number, block: Block, idx: number) => sum + (!block.free ? block.fileId! * idx : 0), 0);
}

function defragmentDisk(disk: Disk) {
  // for each fileId decreasing:
  var fileIds = [...disk.reduce((set: Set<number>, block: Block) => {
    if (!block.free) {
      set.add(block.fileId!);
    }
    return set;
  }, new Set<number>())].sort((a, b) => b - a);

  fileLoop: for (var fileId of fileIds) {
    var fileStart = disk.findIndex((b) => b.fileId === fileId);
    var fileLength = getBlockLengthOfCluster(disk, fileStart);

    // find first empty space that fits this file
    var freeStart = disk.findIndex((b) => b.free);
    var freeLength = getBlockLengthOfCluster(disk, freeStart);

    // console.log(`Checking: ${fileId} @ ${fileStart} l=${fileLength} ==> first free ${freeStart} l=${freeLength}`);

    if (freeStart > fileStart) {
      continue; // can't move a block right
    }

    while (freeLength < fileLength) {
      // if this block of free space is too small, jump to the next cluster (whether free or file)
      freeStart += freeLength;

      // if we hit the end of the disk, we're kinda screwed
      if (freeStart >= disk.length) {
        continue fileLoop;
      }

      // seek until next free space cluster
      while (freeStart < disk.length && !disk[freeStart].free) {
        freeStart++;
      }
      freeLength = getBlockLengthOfCluster(disk, freeStart);
    }

    // check this again
    if (freeStart > fileStart) {
      continue;
    }

    // at this point, freeLength >= fileLength, and fileStart and freeStart are leftmost indexes of file and free space clusters.
    for (var i = 0; i < fileLength; i++) {
      moveBlock(disk, fileStart + i, freeStart + i);
    }
    // console.log(`Moved file id ${fileId} (l=${fileLength}) to pos ${freeStart} (l=${freeLength})`);
  }

  var checksum = checksumDisk(disk);
  // console.log(disk);
  console.log(`The checksum after defragmenting is ${checksum}`);
}

function getBlockLengthOfCluster(disk: Disk, idx: number) {
  // assuming idx is the leftmost block of the cluster
  var end = idx;
  if (disk[idx].free) {
    while (end < disk.length && disk[end].free) {
      end++;
    }
    return end - idx;
  } else {
    while (end < disk.length && disk[end].fileId === disk[idx].fileId) {
      end++;
    }
    return end - idx;
  }
}

function parseDiskIntoBlocks(fileInput: string): Disk {
  var disk: Disk = [];
  var isFile = true; // first block is a file
  var fileId = 0;
  for (var char of fileInput.trim()) {
    var num = parseInt(char);
    for (var i = 0; i < num; i++) {
      disk.push(isFile ? { fileId: fileId, free: false } : { free: true });
    }
    if (isFile) {
      fileId++; // only increment fileId when we finish writing a file, not free space
    }
    isFile = !isFile;
  }

  return disk;
}

function moveBlock(disk: Disk, src: number, dst: number) {
  // moves a block at src to dst, replacing src with free space
  var blockToMove = disk[src];
  disk.splice(dst, 1, blockToMove);
  disk.splice(src, 1, { free: true });
}