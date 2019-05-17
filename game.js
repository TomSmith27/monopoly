document.addEventListener("DOMContentLoaded", main, false);

function main() {
  var board = createBoard();
  var laps = 0;
  let currentPos = 0;
  var doublesInARow = 0;
  let jailsFromDoubles = 0;
  const turns = 100;
  const games = 100;
  var rolls = new Array(12).fill(0);

  function goToJail() {
    //console.log('Jail');
    currentPos = 10;
    doublesInARow = 0;
  }
  for (let game = 0; game < games; game++) {
    currentPos = 0;
    doublesInARow = 0;
    var chanceCards = getChanceCards();

    for (let i = 0; i < turns; i++) {
      var roll = rollDice();
      rolls[roll.value - 1]++;
      if (roll.double) {
        doublesInARow++;
      } else {
        doublesInARow = 0;
      }

      if (doublesInARow == 3) {
        jailsFromDoubles++;
        goToJail();
      } else {
        currentPos = currentPos + roll.value;
        if (currentPos > 39) {
          currentPos = currentPos % 40;
          laps++;
        }
      }
      if (board[currentPos].name == "chance") {
        if (chanceCards.length == 0) {
          chanceCards = getChanceCards();
        }
        chanceCard = chanceCards.pop();
        if (chanceCard != 40) {
          if (typeof chanceCard == "number") {
            currentPos = chanceCard;
          }
        }
      }

      if (currentPos == 30) {
        goToJail();
      }

      board[currentPos].landedCount++;
    }
  }
  var rollDist = rolls.map((b, i) => ({
    name: i + 1,
    chance: (b / (turns * games)) * 100
  }));
  console.log(`Roll distribution`);
  console.log(rollDist);
  console.log(`${laps} laps and ${currentPos} spaces`);
  console.log(board);
  console.log(`jails from doubles ${jailsFromDoubles}`);
  spaceDistribution = board.map(b => ({
    name: b.name,
    chance: (b.landedCount / (turns * games)) * 100,
    color: b.color
  }));
  //.sort(compare);

  console.log(spaceDistribution);

  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: spaceDistribution.map(r => r.name),
      datasets: [
        {
          label: "Chance of lnading on",
          data: spaceDistribution.map(r => r.chance),
          borderWidth: 1,
          backgroundColor: spaceDistribution.map(e => e.color)
        }
      ]
    }
  });

  var ctx = document.getElementById("rolls").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rollDist.map(r => r.name),
      datasets: [
        {
          label: "Chance of lnading on",
          data: rollDist.map(r => r.chance),
          borderWidth: 1,
          backgroundColor: spaceDistribution.map(e => "#0456ec")
        }
      ]
    }
  });
}

function compare(a, b) {
  if (a.chance < b.chance) {
    return -1;
  }
  if (a.chance > b.chance) {
    return 1;
  }
  return 0;
}

function getChanceCards() {
  return shuffle([0, 24, 11, "U", "R", 40, 40, "B", 10, 40, 40, 5, 39, 40, 40, 40]);
}

function rollDice() {
  var dice1 = getRandomInt(6);
  var dice2 = getRandomInt(6);

  return {
    value: dice1 + dice2,
    double: dice1 == dice2
  };
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function createSpace(name, color) {
  return {
    name,
    landedCount: 0,
    color
  };
}

function createBoard() {
  return [
    createSpace("Go"),
    createSpace("Old Kent Road", "#a52a2a"),
    createSpace("Chest"),
    createSpace("White chapel", "#a52a2a"),
    createSpace("Tax"),
    createSpace("Kings", "#535353"),
    createSpace("Angel", "#1c9dbd"),
    createSpace("chance"),
    createSpace("Eu", "#1c9dbd"),
    createSpace("Pent", "#1c9dbd"),
    createSpace("Jail"),
    createSpace("Pall", "#bd1c8d"),
    createSpace("Elec"),
    createSpace("Pin2", "#bd1c8d"),
    createSpace("Pin3", "#bd1c8d"),
    createSpace("Marylebone", "#535353"),
    createSpace("Bow", "#f57702"),
    createSpace("Chest"),
    createSpace("Marl", "#f57702"),
    createSpace("vine", "#f57702"),
    createSpace("free"),
    createSpace("strand", "#d61010"),
    createSpace("chance"),
    createSpace("fleet", "#d61010"),
    createSpace("traf", "#d61010"),
    createSpace("Liverpool", "#535353"),
    createSpace("cov", "#c9eb0a"),
    createSpace("lei", "#c9eb0a"),
    createSpace("water"),
    createSpace("pic", "#c9eb0a"),
    createSpace("jail"),
    createSpace("reg", "#0f8100"),
    createSpace("ox", "#0f8100"),
    createSpace("chest"),
    createSpace("bond", "#0f8100"),
    createSpace("stat4", "#535353"),
    createSpace("chance"),
    createSpace("park", "#020081"),
    createSpace("supertax"),
    createSpace("mayfair", "#020081")
  ];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
