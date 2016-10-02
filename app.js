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
      var forceLayout = d3.select('.force-layout-graph');
      var svg = d3.select(".graph");
      var chartLayer = svg.append("g").classed("chartLayer", true);

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
          }).distance(40).strength(.2))
          .force("collide", d3.forceCollide(20).iterations(6))
          .force("charge", d3.forceManyBody().theta(.5))
          .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
          .force("y", d3.forceY(0))
          .force("x", d3.forceX(0));

        var link = chartLayer.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(data.links)
          .enter()
          .append("line")
          .attr("stroke", "black");

        var node = forceLayout.selectAll('.node')
          .data(data.nodes)
          .enter().append('div')
          .attr('class', function(d) { return 'flag flag-' + d.code; });

        var tick = function () {
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
            .style("left", function (d) {
              return (d.x - 16 + ((window.innerWidth - width) / 2)) + 'px';
            })
            .style("top", function(d) {
              return (d.y - 16) + 'px';
            })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
        };

        simulation
          .nodes(data.nodes)
          .on("tick", tick);

        simulation.force("link")
          .links(data.links);

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.5).restart();
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
      }// END: drawChart()

      setSize(data);
      drawChart(data);
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
        <svg className="graph" width={768} height={768}></svg>
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
