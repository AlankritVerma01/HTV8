const data = {
    // The data from the json file
};

// Used for transforming the code for satisfying the D3.js file
function transformData(node) {
    const children = [];

    if (node.subtopics) {
        for (const subtopic of node.subtopics) {
            children.push(transformData(subtopic));
        }
    } else if (node.details) {
        for (const detail of node.details) {
            children.push({ name: detail });
        }
    }

    return {
        name: node.title,
        children: children.length > 0 ? children : null
    };
}

const transformedData = transformData(data);


// Visualization with D3.js
const svg = d3.select("body").append("svg")
    .attr("width", 800)  // Adjust based on your needs
    .attr("height", 600);  // Adjust based on your needs

const root = d3.hierarchy(transformedData);
const treeLayout = d3.tree().size([800, 600]);  // Adjust based on your needs
treeLayout(root);

// Add links (edges) between nodes
svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

// Add nodes
svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 5);

// Add labels
svg.selectAll('.label')
    .data(root.descendants())
    .enter()
    .append('text')
    .classed('label', true)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('dy', -10)
    .text(d => d.data.name);
// ---------
function renderGraph(root: TreeNode) {
    const rootNode = d3.hierarchy(root);
    treeLayout(rootNode);
  
    const links = svg.selectAll(".link")
      .data(rootNode.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));
  
    const nodes = svg.selectAll(".node")
      .data(rootNode.descendants())
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 10);
  
    // ... (continue with labels and other visual elements)
  }
  