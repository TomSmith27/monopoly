document.addEventListener('DOMContentLoaded', main, false);

function main() {
	var board = createBoard();
	var laps = 0;
	let currentPos = 0;
	var doublesInARow = 0;
	let jailsFromDoubles = 0;
	const turns = 100;
	const games = 10000;
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
			if (board[currentPos].name == 'chance') {
				if (chanceCards.length == 0) {
					chanceCards = getChanceCards();
				}
				chanceCard = chanceCards.pop();
				if (chanceCard != 40) {
					if (typeof chanceCard == 'number') {
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
		chance: b / (turns * games) * 100
	}));
	console.log(`Roll distribution`);
	console.log(rollDist);
	console.log(`${laps} laps and ${currentPos} spaces`);
	console.log(board);
	console.log(`jails from doubles ${jailsFromDoubles}`);
	spaceDistribution = board.map((b) => ({
		name: b.name,
		chance: b.landedCount / (turns * games) * 100
	}));

	console.log(spaceDistribution);

	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: spaceDistribution.map((r) => r.name),
			datasets: [
				{
					label: 'Chance of lnading on',
					data: spaceDistribution.map((r) => r.chance),
					borderWidth: 1,
					backgroundColor: spaceDistribution.map(() => getRandomColor())
				}
			]
		}
	});
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getChanceCards() {
	return shuffle([ 0, 24, 11, 'U', 'R', 40, 40, 'B', 10, 40, 40, 5, 39, 40, 40, 40 ]);
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

function createSpace(name) {
	return {
		name,
		landedCount: 0
	};
}

function createBoard() {
	return [
		createSpace('Go'),
		createSpace('Old Kent Road'),
		createSpace('Chest'),
		createSpace('White chapel'),
		createSpace('Tax'),
		createSpace('King'),
		createSpace('Angel'),
		createSpace('chance'),
		createSpace('Eu'),
		createSpace('Pent'),
		createSpace('Jail'),
		createSpace('Pall'),
		createSpace('Elec'),
		createSpace('Pin2'),
		createSpace('Pin3'),
		createSpace('Stat1'),
		createSpace('Bow'),
		createSpace('Chest'),
		createSpace('Marl'),
		createSpace('vine'),
		createSpace('free'),
		createSpace('strand'),
		createSpace('chance'),
		createSpace('fleet'),
		createSpace('traf'),
		createSpace('stat3'),
		createSpace('cov'),
		createSpace('lei'),
		createSpace('water'),
		createSpace('pic'),
		createSpace('jail'),
		createSpace('reg'),
		createSpace('ox'),
		createSpace('chest'),
		createSpace('bond'),
		createSpace('stat4'),
		createSpace('chance'),
		createSpace('park'),
		createSpace('supertax'),
		createSpace('mayfair')
	];
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ a[i], a[j] ] = [ a[j], a[i] ];
	}
	return a;
}
