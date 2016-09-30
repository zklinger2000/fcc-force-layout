//====
// D3
//====

function buildForceLayout() {
  fetch('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);

      var width, height;
      var chartWidth, chartHeight;
      var margin;
      var svg = d3.select(".graph");
      var chartLayer = svg.append("g").classed("chartLayer", true);

      main()

      function main() {
        // var range = 100
        // var data = {
        //   nodes: d3.range(0, range).map(function (d) {
        //     return {label: "l" + d, r: ~~d3.randomUniform(8, 28)()}
        //   }),
        //   links: d3.range(0, range).map(function () {
        //     return {source: ~~d3.randomUniform(range)(), target: ~~d3.randomUniform(range)()}
        //   })
        // }

        setSize(data);
        drawChart(data);
      }

      function setSize(data) {
        width = document.querySelector(".graph").clientWidth;
        height = document.querySelector(".graph").clientHeight;
        margin = {top: 0, left: 0, bottom: 0, right: 0};
        chartWidth = width - (margin.left + margin.right);
        chartHeight = height - (margin.top + margin.bottom);

        svg.attr("width", width).attr("height", height);

        chartLayer
          .attr("width", chartWidth)
          .attr("height", chartHeight)
          .attr("transform", "translate(" + [margin.left, margin.top] + ")");

      }

      function drawChart(data) {
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function (d) {
            return d.index
          }))
          .force("collide", d3.forceCollide(function (d) {
            return d.r + 8
          }).iterations(16))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
          .force("y", d3.forceY(0))
          .force("x", d3.forceX(0));

        var link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(data.links)
          .enter()
          .append("line")
          .attr("stroke", "black");

        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter().append("circle")
          .attr("r", 5)
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


        var ticked = function () {
          link
            .attr("x1", function (d) {
              return d.source.x;
            })
            .attr("y1", function (d) {
              return d.source.y;
            })
            .attr("x2", function (d) {
              return d.target.x;
            })
            .attr("y2", function (d) {
              return d.target.y;
            });

          node
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y;
            });
        };

        simulation
          .nodes(data.nodes)
          .on("tick", ticked);

        simulation.force("link")
          .links(data.links);


        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      }
    });
}

//=======
// React
//=======

const { Component, PropTypes } = React;

class Chart extends Component {
  componentDidMount() {
    let style = {

    };
    buildForceLayout();
  }

  render() {
    return (
      <div className="force-layout-graph">
        <svg className="graph" width={640} height={480}></svg>
      </div>
    );
  }
}

Chart.propTypes = {

};

//============================================================================
// App Component
//----------------------------------------------------------------------------
//
//============================================================================
class App extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div className="App">
        <Chart />
      </div>
    );
  }
}

App.propTypes = {

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
