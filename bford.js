var colors = require('colors');
var fs = require('fs');
var Table = require('cli-table');

var args = process.argv.slice(2);
var path = `${args[0]}.bf`;

try {
  if (!fs.existsSync(path)) {
		console.log('Graph file not found!'.red);
		process.exit(1);
	}
  var dataArr = fs.readFileSync(path).toString().split('\n');
  const SIZE = dataArr.length;
  var neighbours = [];
  var dataSteps = [];

  // PRE INITIALIZATION
  var data = make3DArray(SIZE, SIZE, SIZE, null);
  var copy = JSON.parse(JSON.stringify(data));
  dataSteps.push(copy);

  // INITIALIZATION
  for (var i = 0; i < SIZE; i++) {
    data[i][i][i] = 0;

    var rawNodeData = dataArr[i].split(' ');
    neighbours.push([]);

    for (var j = 0; j < rawNodeData.length; j++) {
      var connectionData = rawNodeData[j].split('-');
      var to = parseInt(connectionData[0]);
      var cost = parseInt(connectionData[1]);

      neighbours[i].push(to);
      data[i][i][to] = cost;
    }
  }

  var copy = JSON.parse(JSON.stringify(data));
  dataSteps.push(copy);
  console.log('\nInitialization'.bold.magenta);
  copy.forEach((item, i) => {
    console.table(item);
  });

  var thereIsChange = false;
  var counter = 0;

  // ITERATION
  do {
    counter++;
    var propagateDataArr = [];

    var currentShortest = [];
    dataSteps[dataSteps.length - 1].forEach((matrix, i) => {
      currentShortest.push([]);
      for (var j = 0; j < SIZE; j++) {
        var shortestYet = null;
        var shorestK = null;
        matrix.forEach((row, k) => {
          if (row[j] != null) {
            if (shortestYet == null) {
              shortestYet = row[j];
              shorestK = k;
            } else if (row[j] < shortestYet) {
              shortestYet = row[j];
              shorestK = k;
            }
          }
        });
        currentShortest[i].push({
          val: shortestYet,
          row: j
        });
      }
    });

    var pastShortest = [];
    dataSteps[dataSteps.length - 2].forEach((matrix, i) => {
      pastShortest.push([]);
      for (var j = 0; j < SIZE; j++) {
        var shortestYet = null;
        var shorestK = null;
        matrix.forEach((row, k) => {
          if (row[j] != null) {
            if (shortestYet == null) {
              shortestYet = row[j];
              shorestK = k;
            } else if (row[j] < shortestYet) {
              shortestYet = row[j];
              shorestK = k;
            }
          }
        });
        pastShortest[i].push({
          val: shortestYet,
          row: j
        });
      }
    });

    var propagatePlaces = [];

    currentShortest.forEach((itemOuter, i) => {
      itemOuter.forEach((item, j) => {
        if (item.val != null) {
          if (pastShortest[i][j].val == null) {
            propagatePlaces.push(true);
            propagateDataArr.push(new PropagateData(i, item.row, neighbours[i], item.val));
          } else if (item.val < pastShortest[i][j].val) {
            propagatePlaces.push(true);
            propagateDataArr.push(new PropagateData(i, item.row, neighbours[i], item.val));
          }
        } else {
          propagatePlaces.push(false);
        }
      });
    });

    if (propagatePlaces.includes(true)) {
      thereIsChange = true;

      while (propagateDataArr.length > 0) {
        var curPropagateItem = propagateDataArr.shift();
        curPropagateItem.receivers.forEach((rec, i) => {
          var dist = data[rec][rec][curPropagateItem.from];
          var num = curPropagateItem.newShortestValue + dist;
          data[rec][curPropagateItem.from][curPropagateItem.to] = num;
        });
      }

      var copy = JSON.parse(JSON.stringify(data));
      dataSteps.push(copy);
      console.log(`\nIteration-Step ${counter}`.bold.green);
      copy.forEach((item, i) => {
        console.table(item);
      });
    } else {
      thereIsChange = false;
    }
  } while (thereIsChange);
} catch (e) {
  console.log('Error:', e.stack);
}

function make3DArray(xmax, ymax, zmax, def) {
  // Generates a 3D Array with given sizes and standard value def
  var r, x, y, z;
  for (r = [], x = 0; x < xmax; x++)
    for (r[x] = [], y = 0; y < ymax; y++)
      for (r[x][y] = [], z = 0; z < zmax; z++)
        r[x][y][z] = def;
  return r;
}

function PropagateData(from, to, receivers, newShortestValue) {
  this.from = from;
  this.to = to;
  this.receivers = receivers;
  this.newShortestValue = newShortestValue;
}
