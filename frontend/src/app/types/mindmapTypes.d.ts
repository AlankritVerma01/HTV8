// types/index.d.ts

export type NodeData = {
    title: string;
    color: string;
    subtopics?: Array<{ $numberInt: string }> | null; // If you transform data before using it, this can be simplified
};

export type TreeNode = {
    title: string;
    color: string;
    children?: TreeNode[] | null;
};
