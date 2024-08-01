//passing.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const playersAST = [];

//create svg element to hold chart
var svg3 = d3.select("#passing_vis").append("svg")
    .attr("width", 1400)
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
            
                if (current_player.minutes >= 20)
                    playersAST.push(current_player);
            }
        });

        sortAST();

}).catch(function(error) {
console.log(error);
})

//sorts based on the assist to turnover ratio
function sortAST() {
    playersAST.sort((a,b) => {
        return ((b.ast / b.tov) - (a.ast / a.tov));
    });

    var top_ast = playersAST.slice(0,15);

    plot3(top_ast);
}

//plots the players
function plot3(top_ast) {

    console.log(top_ast);
    var p_names = []
    for(var i = 0; i < 15; i++) {
        p_names.push(top_ast[i].name)
        console.log(top_ast[i].ast / top_ast[i].tov, top_ast[i].name)
    }

    //graph label
    svg3.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 700)
    .attr("y", 5)
    .text("Top 15 Assist/Turnover Ratio (Minimum 20 Minutes Per Game)");

    var x3 = d3.scaleBand()
        .range([0, 1150])
        .domain(p_names)
    svg3.append("g")
        .attr("transform", "translate(-50," + 300 + ")")
        .call(d3.axisBottom(x3))

    var y3 = d3.scaleLinear()
        .range([300, 0])
        .domain([2.5, 4.2])
    svg3.append("g")
        .attr("transform", "translate(-50," + 0 + ")")
        .call(d3.axisLeft(y3));

    svg3.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -80)
        .attr("y", -95)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Assist/Turnover Ratio");

    svg3.append("g")
        .selectAll("rect")
        .data(top_ast)
        .enter()
        .append("rect")
            .attr("x", function(_, i) { return -36 + i * 76.5;})
            .attr("y", function(d) {return y3(d.ast / d.tov)}) //base y on the assist to turnover ratio
            .style("fill", "#69b3a2")
            .attr("width", 50)
            .attr("height", function(d) {return 299.5 - y3(d.ast / d.tov)});
}

