"use client";
import React, { useCallback, useState, FormEvent } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const DragDrop = () => {
  // form submit function
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const response = await axios.post("/api/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const resp = response.data;

      window.location.href = `/display?data=${JSON.stringify(resp)}`;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const [file, setFile] = useState<File | null>(null);

  // callback executed on file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setFile(acceptedFiles[0]);
    } else {
      alert("Please upload only one PDF file.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <main>
      <form onSubmit={onSubmit}>
        <div {...getRootProps()} className="">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Release</p>
          ) : file ? (
            <p>{file.name}</p>
          ) : (
            <p>Upload your PDF</p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default DragDrop;
