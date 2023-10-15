"use client";
// components/MindMap.tsx

import React, { useEffect, useRef, useState } from "react";
import styles from "MindMap.module.css";

// Definations -

type MindMapProps = {
  data: {
    [key: string]: {
      title: string;
      subtopics: Array<{ $numberInt: string }>;
      color: string;
    };
  };
};

import { GraphCanvas } from "reagraph";
const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState([]);
  interface Node {
    id: string;
    label: string;
    color?: string;
    size?: number;
  }

  interface Link {
    id: string;
    source: string;
    target: string;
    label: string;
  }

  const nodes: Node[] = [];
  const links: Link[] = [];

  for (let key in data) {
    nodes.push({
      id: key,
      label: data[key].title,
      fill: data[key].color,
      size: 1,
    });
    for (let subtopic of data[key].subtopics) {
      links.push({
        id: `${key}->${subtopic}`,
        source: key,
        target: subtopic,
        label: `Edge ${key}-${subtopic}`,
      });
    }
  }

  let listpoints = [
    "ksdjlksdjfsldkfjslk;dfds",
    "klsdjflksjdfk;ljsdf",
    "flksjdkfjsdlfjsdlkfkldsfjdf",
    "ksdjlksdjfsldkfjslk;dfds",
    "klsdjflksjdfk;ljsdf",
    "flksjdkfjsdlfjsdlkfkldsfjdf",
    "ksdjlksdjfsldkfjslk;dfds",
    "klsdjflksjdfk;ljsdf",
    "flksjdkfjsdlfjsdlkfkldsfjdf",
  ];

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 w-[70%]">
      <div
        className="absolute z-9 p-8 flex flex-col items-center items-between"
        style={{
          zIndex: 9,
          position: "fixed",
          height: "100vh",
          width: "30rem",
          right: 0,
          background: "rgba(0, 0, 0, .5)",
          color: "white",
        }}
      >
        <div>
          <h3 className="font-poppins font-bold text-3xl w-full m-auto">
            Summary
          </h3>
          <div className="w-full">
            <ul>
              {listpoints.map((point) => (
                <li className="font-poppins text-xl relative z-1">&bull; {point}</li>
              ))}
            </ul>
          </div>
        </div>
        <h3>Chat Assistant</h3>
        
      </div>
      <div
        style={{
          right: 50,
        }}
      >
        <GraphCanvas
          collapsedNodeIds={collapsed}
          nodes={nodes}
          edges={links}
          onNodeClick={(node) => {
            if (collapsed.includes(node.id)) {
              setCollapsed(collapsed.filter((id) => id !== node.id));
            } else {
              setCollapsed([...collapsed, node.id]);
              console.log(node.id);
            }
          }}
        />
      </div>
    </div>
  );
};
export default MindMap;
