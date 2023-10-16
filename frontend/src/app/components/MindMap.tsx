"use client";
require("dotenv").config();
// components/MindMap.tsx

import React, { useEffect, useRef, useState } from "react";
import styles from "MindMap.module.css";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import axios from "axios";
import Link from "next/link";

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
  const [summaryHeader, setSummaryHeader] = useState("Summary:");
  const [answer, setAnswer] = useState(
    "Your answer will appear here..."
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
    <div className="absolute top-0 bottom-0 left-0 right-0 w-[58%]">
      <div
        className="absolute z-9 p-8 flex flex-col items-center w-full"
        style={{
          zIndex: 9,
          position: "fixed",
          height: "100vh",
          width: "40rem",
          right: 0,
          background: "rgb(67, 78, 103)",
          color: "white",
        }}
      >
        <div className="w-full mb-10">
          <div className="font-poppins w-full font-bold mb-[1rem] flex justify-between items-center">
            <h3 className="text-3xl">{summaryHeader}</h3>
            <Link href={"/"} className="border-white border-2 px-8 py-2 rounded-xl hover:border-tt ease-in duration-100 hover:text-tt">Home</Link>
          </div>
          <div className="w-full h-[24rem] overflow-y-auto border-white border-2 rounded-xl p-4">
            {activeId ? (
              <ul>
              {listpoints.map((point) => (
                <div>
                  <li className="font-poppins relative z-1">
                    &bull; {point}
                  </li>
                  <br />
                </div>
              ))}
            </ul>
            )
           : (
            <p className="font-poppins relative z-1">
              Click on a node...
            </p>
           )

      }
            
          </div>
        </div>
        <div className="w-full">
          <h3 className="font-poppins font-bold text-3xl mb-[1rem]">Chat Assistant</h3>
          <div className="w-full h-[9rem] mb-4 border-white border-2 rounded-xl p-4 font-poppins overflow-y-auto">
            {answer}
          </div>
          <div className="w-full border-2">
            <TextField
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question here..."
              className="font-poppins w-full p-2 rounded-lg text-white border-white rounded-md bg-transparent"
              sx={{ input: { color: 'white' },
              root: { borderRadius: '12px' }  }}
            />
          </div>
          <p className="font-poppins mt-2">{qDisplay}</p>
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
            setSummaryHeader(node.label);
            if (collapsed.includes(node.id)) {
              setCollapsed(collapsed.filter((id) => id !== node.id));
              if (node.text) {
                const newPoints = node.text.split('\n-');
                newPoints[0] = newPoints[0].slice(1);
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
