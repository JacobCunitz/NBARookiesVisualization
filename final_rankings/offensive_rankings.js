//offensive_rankings.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const players_offense = [];
const second_players = [];


//read in data
d3.csv("NBA Rookies by Year.csv").then(function(data){

        //convert the strings into a number
        data.forEach(function(d) {

            if (d["Year Drafted"] < 2016 && d["Year Drafted"].length > 0) {
                d.MIN = +d.MIN;       //convert to number
                d.DREB = +d.DREB;     //convert to number
                d.STL = +d.STL;       //convert to number
                d.BLK = +d.BLK;       //convert to number
                d.AST = +d.AST;       //convert to number
                d.EFF = +d.EFF;       //convert to number
                d.PTS = +d.PTS;       //convert to number
                d.FGA = +d.FGA;       //convert to number
                d.TOV = +d.TOV;       //convert to number

                //add each player into player array
                let current_player = {
                    "minutes": d.MIN,
                    "name": d.Name,
                    "dreb": d.DREB,
                    "stl": d.STL,
                    "blk": d.BLK,
                    "pts": d.PTS,
                    "fga": d.FGA,
                    "ast": d.AST,
                    "tov": d.TOV,
                    "eff": d.EFF
                }
                if (current_player.minutes >= 20) {
                    players_offense.push(current_player);
                    second_players.push(current_player);
                }
            }
        });

        sortPlayers2()

}).catch(function(error) {
console.log(error);
})

//sorts the players based on their assist to turnover ratio and points
function sortPlayers2() {

    players_offense.sort((a,b) => {
        return ((b.ast / b.tov * (b.pts / 2)) - (a.ast / a.tov * (a.pts / 2)));     //include points to avoid non-impactful players
    });

    sortfga()
}

//sorts players based on points and field goals attempted
function sortfga() {

    second_players.sort((a,b) => {
        return ((b.pts / b.fga * (b.pts / 2)) - (a.pts / a.fga * (a.pts / 2)));     //include points to avoid non-impactful players
    });

    rankPlayers(second_players, players_offense);       //rank the players
}

//this function ranks the players based on the sorted arrays
function rankPlayers(second_players, players_offense) {

    var heat_placement, eff_placement;       //variables to hold the placement for each player

    var temp = players_offense;

    var offensive_ranks = [];                //holds the final rank

    //iterate through each player
    for (var i = 0; i < temp.length; i++) {

        for (var j = 0; j < players_offense.length; j++) {
            if (players_offense[j].name == temp[i].name) {
                eff_placement = j + 1;
            }
        }

        for (var j = 0; j < second_players.length; j++) {
            if (second_players[j].name == temp[i].name) {
                heat_placement = j + 1;
            }
        }

        let ranked_player = {
            "name": temp[i].name,
            "pts": temp[i].pts,
            "rank": (heat_placement + eff_placement) / 2
        }

        offensive_ranks.push(ranked_player);             //push the now ranked player into the array
    }

    sort_ranks(offensive_ranks);
}

//this function sorts the ranked array
function sort_ranks(players2) {

    players2.sort((a,b) => {
        return ((a.rank) - (b.rank));
    });

    const top_players2 = []

    players2 = players2.slice(0,10);

    for(var i = 0; i < 9; i = i + 2) {

        if (players2[i].rank == players2[i + 1].rank) {
            //settle ties with points
            if (players2[i].pts >= players2[i + 1].pts) {
                top_players2.push(players2[i])
                top_players2.push(players2[i + 1])
            }
            else {
                top_players2.push(players2[i + 1])
                top_players2.push(players2[i])
            }
        }
        else {
            top_players2.push(players2[i])
            top_players2.push(players2[i + 1])
        }
    }

    plot_players2(top_players2)
}

//this function plots the players
function plot_players2(players2) {

    var names2 = [];
    //get the names
    for (var i = 9; i >= 0; i--) {
        names2.push(players2[i].name)
    }

    var svg2 = d3.select("#offensive").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 100 + "," + 20 + ")");

    //graph label
    svg2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", 0)
    .text("Offensive Rankings");

    //append y axis
    var y2 = d3.scaleBand()
    .domain(names2)
    .range([ 300, 0]);
    svg2.append("g")
    .call(d3.axisLeft(y2));

    svg2.append("g")
    .selectAll("rect")
    .data(names2)
    .enter()
    .append("rect")
        .attr("x",.5)    //position each rectangle horizontally
        .attr("y", function(_, i) { return 10 + i * 30;})
        .style("fill", "#69b3a2")
        .attr("width", function(_, i) { return (11 - i) * 25;})
        .attr("height", 10);
}