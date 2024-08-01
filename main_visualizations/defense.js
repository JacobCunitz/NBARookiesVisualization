//defense.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const players = [];

//create svg element to hold chart
var svg = d3.select("#defense_vis").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 50 + "," + 8 + ")");

//append x axis
var x = d3.scaleLinear()
.domain([15, 48])
.range([ 0, 300 ]);
svg.append("g")
.attr("transform", "translate(0," + 300 + ")")
.call(d3.axisBottom(x));

//graph label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 230)
    .attr("y", 5)
    .text("Defensive Visualization");

//x-axis label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 210)
    .attr("y", 335)
    .text("Minutes Per Game");

//append y axis
var y = d3.scaleLinear()
.domain([5, 16])
.range([ 300, 0]);
svg.append("g")
.call(d3.axisLeft(y));

//y-axis label
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -45)
    .attr("y", -45)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Blocks + Steals + Defensive Rebounds");


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


//this function takes the array of players, sorts them, and then plots the points
function plot(players) {

        //take only top 100 players
        var top_players = players.slice(0,100);

        //append data points
        svg.append("g")
        .selectAll("dot")
        .data(top_players)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.minutes); })         //calculate x value on graph
            .attr("cy", function(d) { return y(d.dreb + d.stl + d.blk); })                  //calculate y value on graph
            .style("fill", "#69b3a2")
            .attr("r", 3)
        .on("mouseover", function (d,i) {
            d3.select(this) 
            .attr("r", 6)          //make circle larger

            svg.append("text")
            .attr("x", 30)
            .attr("y",70)
            .attr("opacity",1)
            .attr("id", "name")
            .text(i.name)
        })

        .on("mouseout", function (d,i) {
            d3.select(this) 
            .attr("r", 3)      //return the radius back to normal    
            
            //remove the text elements
            d3.select("#name").remove()
        })
}

//sorts the players based on the defensive rebounds, steals, and blocks
function sortPlayers() {
    players.sort((a,b) => {
        return ((b.dreb + b.stl + b.blk) - (a.dreb + a.stl + a.blk));
    });
    plot(players);
}