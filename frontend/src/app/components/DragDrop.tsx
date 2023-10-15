"use client";
import React, { useCallback, useState, FormEvent } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Document, Page } from "react-pdf";

const DragDrop = () => {
  // form submit function
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file as File);
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
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
    <main className="w-full h-[80vh] flex flex-col items-center">
      <form
        onSubmit={onSubmit}
        className="h-full flex flex-col items-center w-full"
      >
        <div
          {...getRootProps()}
          className="border-2 w-[45%] h-full flex justify-center items-center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="font-poppins text-xl">Release</p>
          ) : file ? (
            <iframe
              src={URL.createObjectURL(file)}
              title={file.name}
              width="100%"
              height="100%"
            />
          ) : (
            <p className="font-poppins text-xl">Upload your PDF</p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default DragDrop;
