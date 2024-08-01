//effeciency.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const players_effmin = [];

//create svg element to hold chart
var svg4 = d3.select("#effeciency_vis").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 50 + "," + 8 + ")");

//append x axis
var x4 = d3.scaleLinear()
.domain([15, 48])
.range([ 0, 300 ]);
svg4.append("g")
.attr("transform", "translate(0," + 300 + ")")
.call(d3.axisBottom(x4));

//graph label
svg4.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 260)
    .attr("y", 5)
    .text("Efficiency Rating and Minutes");

//x-axis label
svg4.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 210)
    .attr("y", 335)
    .text("Minutes Per Game");

//append y axis
var y4 = d3.scaleLinear()
.domain([15, 32])
.range([ 300, 0]);
svg4.append("g")
.call(d3.axisLeft(y4));

//y-axis label
svg4.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -100)
    .attr("y", -45)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Efficiency Rating");


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
            
                players_effmin.push(current_player);
            }
        });

        sortPlayerseff();

}).catch(function(error) {
console.log(error);
})


//this function takes the array of players, sorts them, and then plots the points
function plot4(players) {

        //take only top 100 players
        var top_players = players.slice(0,100);

        //append data points
        svg4.append("g")
        .selectAll("dot")
        .data(top_players)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x4(d.minutes); })              //calculate x value on graph
            .attr("cy", function(d) { return y4(d.eff); })                  //calculate y value on graph
            .style("fill", "#69b3a2")
            .attr("r", 3)
        .on("mouseover", function (d,i) {
            d3.select(this) 
            .attr("r", 6)          //make circle larger

            svg4.append("text")
            .attr("x", 30)
            .attr("y",70)
            .attr("opacity",1)
            .attr("id", "name")
            .text(i.name)
        })

        .on("mouseout", function (d,i) {
            d3.select(this) 
            .attr("r", 3)        //return the radius back to normal    
            
            //remove the text elements
            d3.select("#name").remove()
        })
}

//this function sorts the players array based on the EFF stat
function sortPlayerseff() {
    players_effmin.sort((a,b) => {
        return ((b.eff) - (a.eff));
    });
    plot4(players_effmin);
}