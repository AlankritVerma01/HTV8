// Assuming your JSON is stored in a variable called `data`
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

const root = d3.hierarchy(data);
const treeLayout = d3.tree().size([width, height]);
treeLayout(root);