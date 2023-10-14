// components/MindMap.tsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NodeData, TransformedNode } from '../types';

function transformData(node: NodeData): TransformedNode {
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

type MindMapProps = {
    data: NodeData;
};
type PositionedNode = d3.HierarchyNode<TransformedNode> & {
    x: number;
    y: number;
};


const MindMap: React.FC<MindMapProps> = ({ data }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const transformedData = transformData(data);
    
        const svg = d3.select(containerRef.current).append("svg")
            .attr("width", 800)
            .attr("height", 600);
    
        const root = d3.hierarchy(transformedData) as d3.HierarchyNode<TransformedNode>;
        const treeLayout = d3.tree<TransformedNode>().size([800, 600]);
        treeLayout(root);

        // Add links (edges) between nodes
        svg.selectAll('.link')
            .data(root.links())
            .enter()
            .append('line')
            .classed('link', true)
            .attr('x1', d => (d.source as PositionedNode).x)
            .attr('y1', d => (d.source as PositionedNode).y)
            .attr('x2', d => (d.target as PositionedNode).x)
            .attr('y2', d => (d.target as PositionedNode).y);

        // Add nodes
        svg.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('circle')
            .classed('node', true)
            .attr('cx', d => (d as PositionedNode).x)
            .attr('cy', d => (d as PositionedNode).y)
            .attr('r', 5);


        // Add labels
        svg.selectAll('.label')
            .data(root.descendants())
            .enter()
            .append('text')
            .classed('label', true)
            .attr('x', d => (d as PositionedNode).x)
            .attr('y', d => (d as PositionedNode).y)
            .attr('dy', -10)
            .text(d => d.data.name);
    }, [data]);

    return <div ref={containerRef}></div>;
}

export default MindMap;
