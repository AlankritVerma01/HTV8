"use client";
import MindMap from "../../components/MindMap";
import { NodeData } from "../../types/mindmapTypes";
import data from "../../data/data.json";

const TestPage: React.FC = () => {
  return (
    <div>
      <h1 className="display-none">Your Page Title</h1>
      <MindMap data={data as NodeData} />
    </div>
  );
};

export default TestPage;
