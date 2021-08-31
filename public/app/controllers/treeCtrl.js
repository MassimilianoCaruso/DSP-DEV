var dsp_chartCtrl = function ($scope) {

var vm = this;

var diameter = 960;

var margin = {top: 700, right: 500, bottom: 10, left: 600}, // Graph position in the page
    width = diameter,
    height = diameter;
    
var i = 0,
    duration = 350,
    root;

var tree = d3.layout.tree()
    .size([360, diameter / 1.5 - 120])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; }); // Distance between links (? 1 : 2)

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });


var svg = d3.select("#graph").append("svg")
    .attr("width", diameter + margin.right + margin.left) 
    .attr("height", diameter - 200 + margin.bottom + margin.top) //  -200 To give space at the top for the next div in the html page
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("assets/architecturetree/data.json", function(error, HackingCourse) {
  if (error) throw error;

  root = HackingCourse;
  root.x0 = height / 2;
  root.y0 = 0;

  // Initial collapse
  /*
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  */
  
  update(root);

});


d3.select(self.frameElement).style("height", "800px");

var update = function (source) {

  // Compute the new tree layout
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  // Normalize for fixed-depth
  nodes.forEach(function(d) { d.y = d.depth * 150; }); //Link length (150)

  // Add nodes dependencies
  addDependents(nodes);
  nodes.map(function(nodeEnter) {
    addIndex(nodeEnter);
    });

  // Update the nodes
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); })


  // Enter any new nodes at the parent's previous position
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", click)
      .on("dblclick", dblclick)
      .on('mouseover', function(d) {
      //d.name = [...new Set(d.name)]; // Remove duplicates
      //var checkBox = 'input[type="checkbox"]'; // The fade only works if all boxes are checked
      //if ($(checkBox+':checked').length == $(checkBox).length) {
        fade(0.1)(d)
      //}
      })
      .on('mouseout', function(d) {
      //var checkBox = 'input[type="checkbox"]'; // The fade only works if all boxes are checked
      //if ($(checkBox+':checked').length == $(checkBox).length) {
        fade(1)(d);
      //}
      })
   
  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
            .attr("x", function(d) { return d.x < 180 ? "10" : "65"; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) {
                return d.name;
            });

  // Transition nodes to their new position
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  var nodeExit = node.exit().transition()
      .duration(duration)
      //.attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Checkbox
d3.selectAll("input[name=checkb]").on("change", function filterData() {
  function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].defaultValue);
        } 
      }
   return checkboxesChecked.length > 0 ? checkboxesChecked : " ";
  }
  
    var checkedBoxes = getCheckedBoxes("checkb");
      
    node.style("font-weight", "bolder");
    node.style("fill", "rgb(0, 162, 255)");
    link.style("opacity", "1");

      
    node.filter(function(d) {
       return checkedBoxes.indexOf(d.difficulty) === -1 && checkedBoxes.indexOf(d.name) === -1;
      })
      .style("font-weight", "normal")
      .style("fill", "black");

     nodeEnter.filter(function(d) {
      return checkedBoxes.indexOf(d.labels) === -1;
       })
       .style("font-weight", "normal")
       .style("fill", "black");
    
    });

}

var addDependents = function(nodes) {
    var dependents = [];
    nodes.forEach(function(nodeEnter) {
        if (nodeEnter.dependsOn) {
            nodeEnter.dependsOn.forEach(function(dependsOn) {
                if (!dependents[dependsOn]) {
                    dependents[dependsOn] = [];
                }
                dependents[dependsOn].push(nodeEnter.name);
            });
        }
     });
    nodes.forEach(function(nodeEnter, index) {
        if (dependents[nodeEnter.name]) {
           nodes[index].dependents = dependents[nodeEnter.name];
         }
     });
  };   

var addIndex = function (nodeEnter) {
    nodeEnter.index = {
        relatedNodes: []
        };
    var dependsOn = getDetailCascade(nodeEnter, 'dependsOn');
      if (dependsOn.length > 0) {
        nodeEnter.index.relatedNodes = nodeEnter.index.relatedNodes.concat(dependsOn);
      }
 };

var getDetailCascade = function (nodeEnter, detailName) {
    var values = [];
      if (nodeEnter[detailName]) {
          nodeEnter[detailName].forEach(function(value) {
              values.push(value);
          });
       }
      if (nodeEnter.parent) {
          values = values.concat(getDetailCascade(nodeEnter.parent, detailName));
       }
      return values;
  };

var fade = function (opacity) {
    return function(nodeEnter) {
    if(!nodeEnter.children && nodeEnter.parent) {
      nodeEnter.name = [...new Set(nodeEnter.name)]; // Remove duplicates
    }
    d3.selectAll(".node")
      .filter(function(d) {
          if (d.name === nodeEnter.name) return false;
            return nodeEnter.index.relatedNodes.indexOf(d.name) === -1;
          })
      .transition()
      .style("opacity", opacity);
     };
};   

// Toggle children on click
/*
var click = function (d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  
  update(d);
}
*/

// Collapse nodes
var collapse = function(d) {
  if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}

// The stepper loads the labs of the selected training path
var click = function (d){
  if(d.parent.name == 'Buffer Overflow' || d.parent.name == 'Password Cracking' || d.parent.name == 'Denial of Service' ||
     d.parent.name == 'Privilege Escalation' || d.parent.name == 'Web Hacking' ) {
       vm.numlab=d.children.length;
        for(var i=0; i< d.children.length; i++) {
          var lab=d.children[i].name;
          $('#iframe'+i).attr('src', 'http://localhost:18181/lab/use/NS/'+lab);
      }
    }
}

// Double click to scroll down in the page up to the stepper
var dblclick = function (d) {
  document.getElementById("doneButton").click(); // Go to the first step
  $('html,body').animate({
    scrollTop: $(".step").offset().top}, 'slow');
}

}

