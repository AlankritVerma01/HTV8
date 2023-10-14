// types/index.d.ts

export type NodeData = {
    title: string;
    subtopics?: NodeData[];
    details?: string[];
};

export type TransformedNode = {
    name: string;
    children?: TransformedNode[] | null;
};
