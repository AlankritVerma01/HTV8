"use client";
require("dotenv").config();
// components/MindMap.tsx

import React, { useEffect, useRef, useState } from "react";
import styles from "MindMap.module.css";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import axios from "axios";

// Definations -

type MindMapProps = {
  data: {
    [key: string]: {
      title: string;
      children: Array<{ $numberInt: string }>;
      color: string;
    };
  };
};

import { GraphCanvas } from "reagraph";
const MindMap: React.FC<MindMapProps> = ({ data }) => {
  
  const [question, setQuestion] = useState("");
  const handleButtonClick = () => {
    axios
      .post(
        `http://127.0.0.1:5000/question`,
        { question: question },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        }
      )
      .then((response) => {
        console.log("Response from Flask:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const initialCollapsed = Object.keys(data).filter(key => data[key].depth >= 1);
  let [collapsed, setCollapsed] = useState(initialCollapsed);
  interface Node {
    id: string;
    label: string;
    color?: string;
    size?: number;
    depth: number;
  }

  interface Link {
    id: string;
    source: string;
    target: string;
    label: string;
  }

  const nodes: Node[] = [];
  const links: Link[] = [];
  // Initialize collapsed state to include nodes with depth greater than 1

  // const [collapsed, setCollapsed] = useState(initialCollapsed);
  for (let key in data) {
    nodes.push({
      id: key,
      label: data[key].title,
      fill: data[key].color,
      size: data[key].size,
    });
    for (let subtopic of data[key].children) {
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
                <li className="font-poppins text-xl relative z-1">
                  &bull; {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3>Chat Assistant</h3>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Enter any questions"
          minRows={1}
          maxRows={5}
          value={question} // Set the value of the textarea to the state
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", color: "black" }} // Set the width
        />
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Get Text
        </Button>
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
