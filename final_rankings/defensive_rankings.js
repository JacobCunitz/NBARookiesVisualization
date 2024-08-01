//defensive_rankings.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const players = [];

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
            
                players.push(current_player);
            }
        });

        sortPlayers();

}).catch(function(error) {
console.log(error);
})

//sorts the players based on defensive rebounds, steals, and blocks
function sortPlayers() {

    players.sort((a,b) => {
        return ((b.dreb + b.stl + b.blk) - (a.dreb + a.stl + a.blk));
    });

    plot_players(players)

}

//plots the players
function plot_players(players) {

    var names = [];
    for (var i = 9; i >= 0; i--) {
        names.push(players[i].name)
    }

    var svg = d3.select("#defensive").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 100 + "," + 20 + ")");

    //graph label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 200)
        .attr("y", 0)
        .text("Defensive Rankings");

    //append y axis
    var y = d3.scaleBand()
    .domain(names)
    .range([ 300, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
    .selectAll("rect")
    .data(names)
    .enter()
    .append("rect")
        .attr("x",.5)
        .attr("y", function(_, i) { return 10 + i * 30;})
        .style("fill", "#69b3a2")
        .attr("width", function(_, i) { return (11 - i) * 25;})
        .attr("height", 10);
}