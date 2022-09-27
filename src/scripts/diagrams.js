// Apache License Version 2.0

// Copyright 2020 Tobias Anker

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function showData(data, divId, xAxisText)
{
    const box = document.querySelector("#" + divId);

    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 60, bottom: 50, left: 60},
        width = box.offsetWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#" + divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // add x-axis
    const x = d3.scaleLinear()
        .domain([0, data.length])
        .range([ 0, width ]);
    svg.append("g")
        .attr("class", "diagram_axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // add y-axis
    const y = d3.scaleLinear()
       .domain([0, d3.max(data, function(d) { return +d; }) ])
        .range([ height, 0 ]);
    svg.append("g")
        .attr("class", "diagram_axis")
        .call(d3.axisLeft(y));

    // draw line
    svg.append("path")
        .attr("class", "diagram_path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function(d,i) { return x(i) })
            .y(function(d,i) { return y(d) })
        )

    // add text to x-axis
    svg.append("text") 
        .attr("class", "diagram_axis_text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) +")")
        .style("text-anchor", "middle")
        .text(xAxisText);

    // add text to y-axis
    svg.append("text")
        .attr("class", "diagram_axis_text")
        .style("text-anchor", "middle")
        .attr("y", -40)
        .attr("x", -(height / 2))
        .attr("transform", "rotate(-90)")
        .text("Temperature production in C");
}
