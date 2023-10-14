// Definations - 
type RawData = {
  [key: string]: {
    title: string;
    subtopics: Array<{ $numberInt: string }>;
  };
};

type TreeNode = {
  title: string;
  children?: TreeNode[];
  type?: string;
  visible: boolean;
};

// Function to transform the data
function transformData(data: RawData, rootKey: string, layer = 1): TreeNode {
  const node = data[rootKey];
  let children = [];

  for (const subtopic of node.subtopics) {
      children.push(transformData(data, subtopic.$numberInt, layer + 1));
  }

  return {
      title: node.title,
      children: children.length > 0 ? children : undefined,
      type: "someType",
      visible: layer === 1
  };
}

// Initialize the graph 
const width = 800;
const height = 600;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#666");


const treeLayout = d3.tree<TreeNode>().size([width, height]);

// Render the graph 
function renderGraph(root: TreeNode) {
  svg.selectAll("*").remove();

  const rootNode = d3.hierarchy(root) as d3.HierarchyNode<TreeNode>;
  treeLayout(rootNode);

  const links = svg.selectAll(".link")
      .data(rootNode.links().filter(link => link.source.data.visible && link.target.data.visible))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("marker-end", "url(#arrow)")
      .attr("d", d => {
        const source = d.source as d3.HierarchyPointNode<TreeNode>;
        const target = d.target as d3.HierarchyPointNode<TreeNode>;
        return d3.linkVertical()({
            source: [source.x, source.y],
            target: [target.x, target.y]
        });
    });

  const nodeGroups = svg.selectAll(".node-group")
      .data(rootNode.descendants().filter(node => node.data.visible))
      .enter()
      .append("g")
      .attr("class", "node-group")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

  nodeGroups.append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", d => {
          switch (d.data.type) {
              case "type1": return "red";
              case "type2": return "blue";
              default: return "gray";
          }
      });

  nodeGroups.filter((d: d3.HierarchyNode<TreeNode>) => !!d.children && d.children.length > 0)
      .append("circle")
      .attr("class", "expand-collapse-button")
      .attr("r", 5)
      .attr("cy", 15)
      .attr("fill", "white")
      .attr("stroke", "black")
      .on("click", toggleChildrenVisibility);


  nodeGroups.append("text")
      .attr("class", "node-label")
      .attr("dy", 5)
      .attr("dx", 15)
      .text(d => d.data.title);
}

// --------


// // Render the graph
// function renderGraph(root: TreeNode) {
//   svg.selectAll("*").remove();  // Clear the current graph
//   const rootNode = d3.hierarchy(root);
//   treeLayout(rootNode);
//   // Add links (edges) between nodes
//   const links = svg.selectAll(".link")
//     .data(rootNode.links().filter(link => link.source.data.visible && link.target.data.visible))
//     .enter()
//     .append("path")
//     .attr("class", "link")
//     .attr("marker-end", "url(#arrow)")
//     .attr("d", d3.linkVertical()
//         .x(d => d.x)
//         .y(d => d.y));
  
//   // Add nodes
//   const nodeGroups = svg.selectAll(".node-group")
//     .data(rootNode.descendants().filter(node => node.data.visible))
//     .enter()
//     .append("g")
//     .attr("class", "node-group")
//     .attr("transform", d => `translate(${d.x}, ${d.y})`);
  

//   nodeGroups.append("circle")
//     .attr("class", "node")
//     .attr("r", 10)
//     .attr("fill", d => {
//         switch (d.data.type) {
//             case "type1": return "red";
//             case "type2": return "blue";
//             default: return "gray";
//         }
//     });
//      const nodes = svg.selectAll(".node")
//         .data(rootNode.descendants().filter(node => node.data.visible))
//         .enter()
//         .append("circle")
//         .attr("class", "node")
//         .attr("cx", d => d.x)
//         .attr("cy", d => d.y)
//         .attr("r", 10)
//         .attr("fill", d => {
//             switch (d.data.type) {
//                 case "type1": return "red";
//                 case "type2": return "blue";
//                 default: return "gray";
//             }
//      })
//      .on("click", toggleChildrenVisibility);
//       svg.selectAll(".node-label")
//         .data(rootNode.descendants().filter(node => node.data.visible))
//         .enter()
//         .append("text")
//         .attr("class", "node-label")
//         .attr("x", d => d.x + 15)  // Adjust for positioning
//         .attr("y", d => d.y + 5)   // Adjust for positioning
//         .text(d => d.data.title);
  
//     // ... (continue with labels and other visual elements)
//   }


function toggleChildrenVisibility(d: d3.HierarchyNode<TreeNode>) {
  if (d.children) {
      d.children.forEach((child: d3.HierarchyNode<TreeNode>) => {
          child.data.visible = !child.data.visible;
      });
  }
  renderGraph(transformedRoot);
}

const transformedRoot = transformData(data, "1");
renderGraph(transformedRoot);