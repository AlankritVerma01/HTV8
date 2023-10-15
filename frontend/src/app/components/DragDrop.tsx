"use client";
import React, { useCallback, useState, FormEvent } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

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
    <main className="w-full h-[80vh] flex flex-col items-center mt-8 relative text-white">
      <form
        onSubmit={onSubmit}
        className="h-full flex flex-col items-center w-full"
      >
        <div
          {...getRootProps()}
          className="border-2 w-[40%] h-full flex justify-center items-center"
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
            <p className="font-poppins text-3xl flex">
              Upload your PDF{"  "}
              <span className="flex items-center ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#ffffff"
                  className="inline-block"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
                </svg>
              </span>
            </p>
          )}
        </div>
        <div className="w-[40%] flex justify-end">
          <button
            type="submit"
            className="font-poppins font-medium border-[0.17rem] border-tt text-tt rounded-full py-2 px-14 mt-4"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default DragDrop;
