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
import { TextField } from "@mui/material";
const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [qDisplay, setQDisplay] = useState("");
  const [answer, setAnswer] = useState(
    "Your answer will appear here after you ask questions in the chatbox..."
  );
  const [isTypingEffect, setIsTypingEffect] = useState(false);

  const handleButtonClick = () => {
    axios
      .post(
        `http://127.0.0.1:5000/question`,
        { question: question, id: activeId },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        }
      )
      .then((response) => {
        setIsTypingEffect(true); // Enable the typewriter effect
        setAnswer(response.data.answer);
        setQuestion("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };



  const [activeId, setActiveId] = useState("");

  const initialCollapsed = Object.keys(data).filter(
    (key) => data[key].depth >= 1
  );
  let [collapsed, setCollapsed] = useState(initialCollapsed);
  useEffect(() => {
    if (isTypingEffect) {
      setTimeout(() => setIsTypingEffect(false), 3000); // Adjust the duration to match your animation time
    }
  }, [isTypingEffect]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setQDisplay("Question: " + question);
      handleButtonClick();
    }
  };

  interface Node {
    id: string;
    label: string;
    color?: string;
    size?: number;
    depth: number;
    text?: string;
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
      text: data[key].text,
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

  const [listpoints, setListpoints] = useState([
    // ... (Other initial points)
  ]);


  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 w-[55%]">
      <div
        className="absolute z-9 p-8 flex flex-col items-center w-full"
        style={{
          zIndex: 9,
          position: "fixed",
          height: "100vh",
          width: "45rem",
          right: 0,
          background: "rgba(0, 0, 0, .5)",
          color: "white",
        }}
      >
        <div className="w-full mb-10">
          <h3 className="font-poppins font-bold text-3xl mb-4">Summary:</h3>
          <div className="w-full h-72 overflow-y-auto border-white border-2 rounded-md p-4">
            <ul>
              {listpoints.map((point) => (
                <li className="font-poppins text-lg relative z-1">
                  &bull; {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <h3 className="font-poppins font-bold text-3xl">Chat Assistant</h3>
          <div className="w-full h-56 mb-4 border-white border-2 rounded-md p-4 font-poppins">
            {answer}
          </div>
          <div className="w-full">
            <TextField
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              className="font-poppins w-full h-[2.3rem] p-2 rounded-lg text-white bg-transparent"
            />
          </div>
          <p className="font-poppins mt-6">{qDisplay}</p>
        </div>
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
            setActiveId(node.id);
            if (collapsed.includes(node.id)) {
              setCollapsed(collapsed.filter((id) => id !== node.id));
              if (node.text) {
                const newPoints = node.text.split('\n-');
                setListpoints(newPoints);
              }
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
