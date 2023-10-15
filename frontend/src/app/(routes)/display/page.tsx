"use client";
import MindMap from "../../components/MindMap";
import { NodeData } from "../../types/mindmapTypes";

// This has to be changed to fetch the data from the database
import data from "../../data/data.json"; // Import the dummy data
import test from "node:test";


type Article = {
  _id: { $oid: string };
  id: string;
  title: string;
  description: string;
  nodes: {
    [key: string]: {
      title: string;
      subtopics: Array<{ $numberInt: string }>;
      color: string;
    };
  };
};

const TestPage: React.FC = () => {
  //const fetchedArticle: Article = fetchArticleFunction(); // Pseudo-function



  // return (
  //   <div>
  //     <h1>{fetchedArticle.title}</h1>
  //     <p>{fetchedArticle.description}</p>
  //     <MindMap data={fetchedArticle.nodes} />
  //   </div>
  // );

  return (
    <div className="">
        <MindMap data={data.nodes} /> {/* Pass the nodes object from the dummy data to the MindMap component */}
    </div>
);

};

export default TestPage;