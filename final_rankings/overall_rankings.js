//overall_rankings.js
//Jacob Cunitz (z1929689)
//CSCI 490 - 00N9
//Professor - Dr. Maoyuan Sun

const eff_array = [];
const def_array = [];
const fga_array = [];
const ast_array  = [];


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
                //only include players that average over 20 minutes
                if (current_player.minutes >= 20) {
                    eff_array.push(current_player);
                    def_array.push(current_player);
                    fga_array.push(current_player);
                    ast_array.push(current_player)
                }
            }
        });

        sortPlayers3()           //begin sorting

}).catch(function(error) {
console.log(error);
})

//sort the array based on EFF
function sortPlayers3() {

    eff_array.sort((a,b) => {
        return ((b.eff) - (a.eff));
    });

    //call all other sort functions
    sortfga3()
    sortdef()
    sortast()
}

//this function sorts based on points and field goals attempted
function sortfga3() {

    fga_array.sort((a,b) => {
        return ((b.pts / b.fga * (b.pts / 2)) - (a.pts / a.fga * (a.pts / 2)));   //multiply by points to ensure high scoring players are first
    });
}

//sorts based on defensive rebounds, steals, and blocks
function sortdef() {

    def_array.sort((a,b) => {
        return ((b.dreb + b.stl + b.blk) - (a.dreb + a.stl + a.blk));
    });
}

//sorts based on assist to turnover ratio, includes points to ensure better players are prioritzied
function sortast() {

    ast_array.sort((a,b) => {
        return ((b.ast / b.tov * (b.pts / 2)) - (a.ast / a.tov * (a.pts / 2)));
    });

    rankPlayers2(fga_array, eff_array, def_array, ast_array);   //call the function that ranks the players
}

//ranks the players based on the sorted arrays
function rankPlayers2(fga_array, eff_array, def_array, ast_array) {

    var fga_placement, eff_placement, def_placement, ast_placement;      //variables to hold the placements

    var temp = eff_array;

    var final_ranks = [];    //array to hold final overall rankings

    //iterate through all players
    for (var i = 0; i < temp.length; i++) {
        //find players placement in the EFF array
        for (var j = 0; j < eff_array.length; j++) {
            if (eff_array[j].name == temp[i].name) {
                eff_placement = j + 1;
            }
        }
        //find players placement in the FGA array
        for (var j = 0; j < fga_array.length; j++) {
            if (fga_array[j].name == temp[i].name) {
                fga_placement = j + 1;
            }
        }
        //find players placement in the DEF array
        for (var j = 0; j < def_array.length; j++) {
            if (def_array[j].name == temp[i].name) {
                def_placement = j + 1;
            }
        }
        //find players placement in the AST array   
        for (var j = 0; j < ast_array.length; j++) {
            if (ast_array[j].name == temp[i].name) {
                ast_placement = j + 1;
            }
        }

        //format an object holding the ranked player
        let ranked_player = {
            "name": temp[i].name,
            "pts": temp[i].pts,
            "rank": (fga_placement * 15 + def_placement * 2 + eff_placement * 25 + ast_placement / 15) / 4    //calculate rank, weighing more important sections
        }

        final_ranks.push(ranked_player);       //player is now in the final ranks
    }

    sort_ranks2(final_ranks);
}

//this function now sorts based on rank to find the best players
function sort_ranks2(players3) {

    players3.sort((a,b) => {
        return ((a.rank) - (b.rank));
    });

    const top_players3 = []

    players3 = players3.slice(0,10);   //take top 10

    for(var i = 0; i < 9; i = i + 2) {

        if (players3[i].rank == players3[i + 1].rank) {

            //settle ties by points
            if (players3[i].pts >= players3[i + 1].pts) {
                top_players3.push(players3[i])
                top_players3.push(players3[i + 1])
            }
            else {
                top_players3.push(players3[i + 1])
                top_players3.push(players3[i])
            }
        }
        else {
            top_players3.push(players3[i])
            top_players3.push(players3[i + 1])
        }
    }

    plot_players3(top_players3)
}

//plots the top players
function plot_players3(players3) {

    var names3 = [];
    //collect the names for the axis
    for (var i = 9; i >= 0; i--) {
        names3.push(players3[i].name)
    }

    //create svg element
    var svg3 = d3.select("#overall").append("svg")
    .attr("width", 400)
    .attr("height", 350)
    .append("g")
    .attr("transform",
        "translate(" + 100 + "," + 20 + ")");

    //graph label
    svg3.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 180)
    .attr("y", 0)
    .text("Overall Rankings");

    //append y axis
    var y3 = d3.scaleBand()
    .domain(names3)
    .range([ 300, 0]);
    svg3.append("g")
    .call(d3.axisLeft(y3));

    //add the horizontal bar for each player
    svg3.append("g")
    .selectAll("rect")
    .data(names3)
    .enter()
    .append("rect")
        .attr("x",.5)
        .attr("y", function(_, i) { return 10 + i * 30;})
        .style("fill", "#69b3a2")
        .attr("width", function(_, i) { return (11 - i) * 25;})
        .attr("height", 10);
}