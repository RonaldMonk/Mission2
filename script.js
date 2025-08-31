const constituencyAndList = [ // Array for each region
  {
    "region": "Central Scotland",
    "constSeats": [9, 0, 0, 0, 0, 0], //Constituency seats won by each party in the order SNP, Alba, Green, Labour, Conservative and Liberal democrats
    "listVotes": [148399, 5345, 19512, 77623, 59896, 6337], //regional list votes
    "altVotes": [0, 79544.5, 93711.5, 77623, 59896, 6337] // SNP votes given to Alba and Greens 50/50. I might not have time for this.
  },
  {
    "region": "Glasgow",
    "constSeats": [9, 0, 0, 0, 0, 0],
    "listVotes": [147091, 7820, 50364, 70942, 33758, 9523],
    "altVotes": [0, 81365.5, 123909.5, 70942, 33758, 9523]
  },
  {
    "region": "Highlands and Islands",
    "constSeats": [6, 0, 0, 0, 0, 2],
    "listVotes": [96433, 3828, 6788, 22713, 60779, 26771],
    "altVotes": [0, 52044.5, 55004.5, 22713, 60779, 26771]
  },
  {
    "region": "Lothian",
    "constSeats": [7, 0, 0, 1, 0, 1],
    "listVotes": [163022, 14973, 43936, 80518, 50678, 27160],
    "altVotes": [0, 96484, 125447, 80518, 50678, 27160]
  },
  {
    "region": "Mid Scotland and Fife",
    "constSeats": [8, 0, 0, 0, 0, 1],
    "listVotes": [121094, 7064, 29996, 59077, 75061, 19911],
    "altVotes": [0, 67611, 90543, 59077, 75061, 19911]
  },
  {
    "region": "North East Scotland",
    "constSeats": [9, 0, 0, 0, 1, 0],
    "listVotes": [158145, 10235, 34565, 69861, 80787, 24025],
    "altVotes": [0, 89307.5, 113617.5, 69861, 80787, 24025]
  },
  {
    "region": "South Scotland",
    "constSeats": [6, 0, 0, 0, 3, 0],
    "listVotes": [133526, 8572, 28931, 60185, 84028, 22529],
    "altVotes": [0, 75335, 95694, 60185, 84028, 22529]
  },
  {
    "region": "West Scotland",
    "constSeats": [8, 0, 0, 1, 1, 0],
    "listVotes": [147689, 10914, 28281, 71024, 63173, 19465],
    "altVotes": [0, 84758.5, 102125.5, 71024, 63173, 19465]
  }
];

function createVoteTable(voteArray, seatsVotes){ //Create a table to display votes per region
let txt="<tr><th>Region</th><th>SNP</th><th>Alba</th><th>Green</th><th>Labour</th><th>Cons</th><th>Libdem</th></tr>"; // Headings
  for (const region of voteArray) { // for each region...
    txt +=`<tr><td>${region["region"]}</td>`; // Make a table entry for the name of the region
    for (const voteList of region[seatsVotes]) { // for each party...
      txt += `<td>${voteList}</td>`; // make table row entries for their votes or seat
    }
    txt +="</tr>" // Complete the row
  }
  return txt;
}
// =========================display the constituency seats and regional list votes ================================
document.getElementById("const-seats").innerHTML = createVoteTable(constituencyAndList, "constSeats"); // display constituency results

document.getElementById("list-seats").innerHTML = createVoteTable(constituencyAndList, "listVotes"); // display regional list votes

const parties = ["SNP", "Alba", "Green", "Labour", "Cons", "Libdem"];
const centralListVotes = constituencyAndList[0].listVotes; //copy regional list votes for Central Scotland into a new array
const listVotesWon = [0, 0, 0, 0, 0, 0];
const centralConstVotes = constituencyAndList[0].constSeats; // copy constituency seat count into a new array
const line3Desc = "List seats won";

let tableLine2 = "<td>Constituency Seats</td>"; //set up content of table for D'Hondt demonstration
for (const i of constituencyAndList[0].constSeats) {
  tableLine2 += `<td>${i}</td>`;// set up table data entries for constituency results
}
tableLine2 += "<td></td>";
document.getElementById("const-won").innerHTML = tableLine2; // fixed content so this can be displayed just once
let tableLine4 = "<td>Votes cast</td>"; // construct
for (const k of constituencyAndList[0].listVotes) {
  tableLine4 += `<td>${k}`;
};
tableLine4 += "<td></td>";
document.getElementById("votes-cast").innerHTML = tableLine4;
let currentRound = 0;

function dHondtReset() {
  currentRound = 0;
  for (const listArray in listVotesWon) {
    listVotesWon[listArray] = 0;
  }
  let tableLine3 = `<td>${line3Desc}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td>` // reset list seats won to all blank
  document.getElementById("list-won").innerHTML = tableLine3;
  for (let j=1; j<=7; j++) {
    document.getElementById(`round${j}`).innerHTML =
    `<td>-</td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td>`; // clear rounds lines
  }
  document.getElementById("round-btn").innerHTML = "Start";
}
const dHondt = document.getElementById("round-btn");
dHondt.addEventListener("click", nextDHondtRound);

dHondtReset();

function nextDHondtRound() {
  currentRound++;
  let dHontArray;
  let text = `<td>Round ${currentRound}</td>`
  if (currentRound === 8) {
    dHondtReset();
  } else {
    dHontArray = centralListVotes.map(function(votes, inx){
      return Math.round(votes/(centralConstVotes[inx]+listVotesWon[inx]+1));
    });
    let max = dHontArray[0];
    let maxInx = 0;
    for (let party in dHontArray) {
      if (dHontArray[party] >max) {
        max = dHontArray[party];
        maxInx = party;
      }
    };
    for (party of dHontArray) {
      text += `<td>${party}</td>`
    }
    text += `<td style="text-align: left">${parties[maxInx]}</td>`
    document.getElementById(`round${currentRound}`).innerHTML = text;
    text = `<td>${line3Desc}</td>`;
    listVotesWon[maxInx]++;
    for (party of listVotesWon) {
      text += `<td>${party}</td>`
    };
    text += "<td></td>";
    document.getElementById("list-won").innerHTML = text;
    document.getElementById("round-btn").innerHTML = (currentRound === 7)? "Reset": "Next";
  }

}