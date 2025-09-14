"use strict";
const constituencyAndList = [ // Array for each region
  {
    region: "Central Scotland",
    constSeats: [9, 0, 0, 0, 0, 0], //Constituency seats won by each party in the order SNP, Alba, Green, Labour, Conservative and Liberal democrats
    listVotes: [148399, 5345, 19512, 77623, 59896, 6337] //regional list votes in the same order as constituency seats
  },
  {
    region: "Glasgow",
    constSeats: [9, 0, 0, 0, 0, 0],
    listVotes: [147091, 7820, 50364, 70942, 33758, 9523]
  },
  {
    region: "Highlands and Islands",
    constSeats: [6, 0, 0, 0, 0, 2],
    listVotes: [96433, 3828, 6788, 22713, 60779, 26771]
  },
  {
    region: "Lothian",
    constSeats: [7, 0, 0, 1, 0, 1],
    listVotes: [163022, 14973, 43936, 80518, 50678, 27160]
  },
  {
    region: "Mid Scotland and Fife",
    constSeats: [8, 0, 0, 0, 0, 1],
    listVotes: [121094, 7064, 29996, 59077, 75061, 19911]
  },
  {
    region: "North East Scotland",
    constSeats: [9, 0, 0, 0, 1, 0],
    listVotes: [158145, 10235, 34565, 69861, 80787, 24025]
  },
  {
    region: "South Scotland",
    constSeats: [6, 0, 0, 0, 3, 0],
    listVotes: [133526, 8572, 28931, 60185, 84028, 22529]
  },
  {
    region: "West Scotland",
    constSeats: [8, 0, 0, 1, 1, 0],
    listVotes: [147689, 10914, 28281, 71024, 63173, 19465]
  }
];
const parties = ["SNP", "Alba", "Green", "Labour", "Cons", "Libdem"];
let partiesCells = "";
for (const partyName of parties) {
  partiesCells += `<th>${partyName}</th>`; // make a line of cells with party names in each cell
}
let regionInx;
let partyInx;
let workingListVotes = [];
for (regionInx = 0; regionInx < constituencyAndList.length; regionInx++) {
  workingListVotes.push([0, 0, 0, 0, 0, 0]);
}

function createVoteTable(voteArray, seatsVotes){ //Create a table to display votes per region
  let txt = `<tr><th>Region</th>${partiesCells}</tr>`;
    //let txt="<tr><th>Region</th><th>SNP</th><th>Alba</th><th>Green</th><th>Labour</th><th>Cons</th><th>Libdem</th></tr>"; // Headings for first row
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
// D'Hondt section=================================================================
//===================================================================================
const listSeatsWon = [0, 0, 0, 0, 0, 0];
const line3Desc = "List seats won";
let currentRound;
let currentRegion = 0;
let currentDataset = 1;
changeDataset();

function dHondtReset() { // beginning and reset position of variables to be displayed and controlling variables (which round we're on)
  currentRound = 0;
  let tableLine1 = `<th>${constituencyAndList[currentRegion].region}</th>${partiesCells}</th><th>Winner of round</th>`; //table headings
  document.getElementById("table3-headings").innerHTML = tableLine1;
  let tableLine2 = "<td>Constituency Seats</td>"; //set up content of table for D'Hondt demonstration
  for (const i of constituencyAndList[currentRegion].constSeats) {
    tableLine2 += `<td>${i}</td>`;// set up table data entries for constituency results
  }
  tableLine2 += "<td></td>";
  document.getElementById("const-won").innerHTML = tableLine2; // fixed content so this can be inserted into the table just once
  for (const listArray in listSeatsWon) { // zero out all the regional list
    listSeatsWon[listArray] = 0;
  }

  let tableLine3 = `<td>${line3Desc}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td>` // reset list seats won to all zeros
  document.getElementById("list-won").innerHTML = tableLine3; // append list seats line to table
  let tableLine4 = "<td>List votes cast</td>"; // start constructing 4th line of the table
  for (const k of workingListVotes[currentRegion]) {
    tableLine4 += `<td>${k}</td>`; // add each cell to the table row
  }
  tableLine4 += "<td></td>"; // append an empty cell so that the border works properly
  document.getElementById("votes-cast").innerHTML = tableLine4; // insert row 4 which is fixed and doesn't have to be worried about any more

  for (let j=1; j<=7; j++) {
    document.getElementById(`round${j}`).innerHTML =
    `<td>-</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`; // clear rounds lines
  }
  document.getElementById("round-btn").innerHTML = "Start"; // set button text for start of D'Hondt run
}

const dHondt = document.getElementById("round-btn"); // set up listener for Start/Next round/Restart button
dHondt.addEventListener("click", nextDHondtRound);
const regionSelect = document.getElementById("current-region"); // set up event listener for region button
region.addEventListener("click", changeRegion);
const datasetSelect = document.getElementById("dataset"); // event listener for data set button
datasetSelect.addEventListener("click", changeDataset);
dHondtReset();
document.getElementById("region").innerHTML = constituencyAndList[currentRegion].region;

function nextDHondtRound() {
  currentRound++;
  let dHontArray;
  let party;
  let text = `<td>Round ${currentRound}</td>` // start setting up table row for D'Hondt round
  if (currentRound === 8) {
    dHondtReset();
  } else {
    dHontArray = workingListVotes[currentRegion].map(function(votes, inx){
      return Math.round(votes/(constituencyAndList[currentRegion].constSeats[inx]+listSeatsWon[inx]+1)); // apply the D'Hondt formula to all the party votes
    });
    let max = dHontArray[0];
    let maxInx = 0;
    for (party in dHontArray) {
      if (dHontArray[party] >max) {
        max = dHontArray[party]; // Find the winning party
        maxInx = party; // and save the index
      }
    };
    for (party of dHontArray) {
      text += `<td>${party}</td>` // collect D'Hondt results into a string
    }
    text += `<td style="text-align: left">${parties[maxInx]}</td>` // override style to make winning party string left aligned
    document.getElementById(`round${currentRound}`).innerHTML = text; // and append to the table
    text = `<td>${line3Desc}</td>`; // set up row for updated regional list seats
    listSeatsWon[maxInx]++; // increment regional list seats of round winner
    for (party of listSeatsWon) {
      text += `<td>${party}</td>` // collect party seats won into a string
    };
    text += "<td></td>"; // add a cell to the end of the string
    document.getElementById("list-won").innerHTML = text;
    document.getElementById("round-btn").innerHTML = (currentRound === 7)? "Reset": "Next round"; // If on round 7 changes button text
  }
}

function changeRegion() {
  currentRegion++;
  if (currentRegion > 7) {
    currentRegion = 0;
  }
  document.getElementById("region").innerHTML = constituencyAndList[currentRegion].region; // change text for region button
  dHondtReset();
}

function changeDataset() {
  let temp;
  currentDataset++;
  if (currentDataset > 1) currentDataset = 0;
  for (regionInx = 0; regionInx < constituencyAndList.length; regionInx++) { // for each region..
    for (partyInx = 0; partyInx < parties.length; partyInx++) { // and each party's vote
      workingListVotes[regionInx][partyInx] = constituencyAndList[regionInx].listVotes[partyInx]; // copy list votes to an array that can be safely altered
    }
    if (currentDataset === 1) { // i.e. the 50/50 scenario where SNP votes are shared out between Alba and Green parties
      temp = workingListVotes[regionInx][0]/2; // divide SNP by 2 and save for later
      workingListVotes[regionInx][0] = 0; // SNP votes to zero. They will be shared out evenly and given to..
      workingListVotes[regionInx][1] += Math.floor(temp); // the Alba pro-independence party..
      workingListVotes[regionInx][2] += Math.ceil(temp); // and the Grens who are also pro-indy
      document.getElementById("dataset").innerHTML = "Alba/Green 50/50" // change the text for the data set button
    } else document.getElementById("dataset").innerHTML = "2021 results";
  }
  dHondtReset();
}