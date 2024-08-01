//offense.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const playersEFF = [];
const columns = ["EFF", "FGA", "POINTS"]

//create svg element to hold chart
var svg2 = d3.select("#offense_vis").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 98 + "," + 20 + ")");


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
            
                playersEFF.push(current_player);
            }
        });

        sortEFF();

}).catch(function(error) {
console.log(error);
})

//sorts the players array based on the effeciency rating
function sortEFF() {
    playersEFF.sort((a,b) => {
        return ((b.eff) - (a.eff));
    });

    var top_eff = playersEFF.slice(0,15);     //take the top 15
    const player_names = []

    for (var i = 0; i < 15; i++) {
        player_names.push(top_eff[i].name)
    }

    plot2(player_names, top_eff);
}

//plot the players
function plot2(names, top_eff) {

    //graph label
    svg2.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 180)
        .attr("y", -7)
        .text("Offensive Heat Map");

    var x2 = d3.scaleBand()
        .range([ 0, 300 ])
        .domain(columns)
        .padding(0.01);
    svg2.append("g")
        .attr("transform", "translate(0," + 300 + ")")
        .call(d3.axisBottom(x2))

    var y2 = d3.scaleBand()
        .range([ 300, 0 ])
        .domain(names)
        .padding(0.01);
    svg2.append("g")
        .call(d3.axisLeft(y2));


    svg2.append("g")
        .selectAll("g")
        .data(top_eff)
        .enter()
        .append("g")
        .each(function(d, index) {
            d3.select(this).selectAll("rect")
                .data([0,1,2])                    //3 bars per player for heat map
                .enter()
                .append("rect")
                    .attr("x", function(_, i) {return 4 + i * 98;})    
                    .attr("y", function(_, i) {return 279 + index * -20})
                    .style("fill", function(_, i) {return getColor(d,i)})      //call getColor to determine the color
                    .attr("width", 98)
                    .attr("height", 20);
});
}

//calls the specific functions for each category to get color
function getColor(d, i) {
    if (i == 0) {
        return getEff(d);
    }
    else if (i == 1) {
        return getFGA(d);
    }
    else {
        return getPoints(d);
    }
}

//determines color for the EFF
function getEff(d) {
    if (d.eff < 22) {
        return "#05C230"      
    }
    else if (d.eff >= 22 && d.eff < 23.5) {
        return "#69C205"
    }
    else if (d.eff >= 23.5 && d.eff < 25) {
        return "#AEC205"
    }
    else if (d.eff >= 25 && d.eff < 26.5) {
        return "#C2A805"
    }
    else if (d.eff >= 26.5 && d.eff < 28) {
        return "#C26F05"
    }
    else if (d.eff >= 28 && d.eff < 29.5) {
        return "#C24705"
    }
    else{
        return "#C20505"
    }
}

//determines color for the FGA
function getFGA(d) {
    if (d.fga < 12) {
        return "#05C230"      
    }
    else if (d.fga >= 12 && d.fga < 13.3) {
        return "#69C205"
    }
    else if (d.fga >= 13.3 && d.fga < 14.6) {
        return "#AEC205"
    }
    else if (d.fga >= 14.6 && d.fga < 15.9) {
        return "#C2A805"
    }
    else if (d.fga >= 15.9 && d.fga < 17.2) {
        return "#C26F05"
    }
    else if (d.fga >= 17.2 && d.fga < 18.5) {
        return "#C24705"
    }
    else{
        return "#C20505"
    }
}

//determines color for the points
function getPoints(d) {
    if (d.pts < 20) {
        return "#05C230"      
    }
    else if (d.pts >= 20 && d.pts < 22) {
        return "#69C205"
    }
    else if (d.pts >= 22 && d.pts < 24) {
        return "#AEC205"
    }
    else if (d.pts >= 24 && d.pts < 26) {
        return "#C2A805"
    }
    else if (d.pts >= 26 && d.pts < 28) {
        return "#C26F05"
    }
    else if (d.pts >= 28 && d.pts < 30) {
        return "#C24705"
    }
    else{
        return "#C20505"
    }
}