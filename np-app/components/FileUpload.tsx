import { useState, useEffect } from "react";
import UploadService from "../src/app/services/FileUploadService";
import IFile from "../src/app/types/File";
import React from "react";

export const FileUpload: React.FC<{ sharedValue: string; onUpdate: (newValue: string) => void }> = (
    { sharedValue, onUpdate }
) => {
    // const FileUpload: React.FC = (({ sharedValue, onUpdate })) => {
    const [currentFile, setCurrentFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [fileInfos, setFileInfos] = useState<Array<IFile>>([]);

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFiles = files as FileList;
        setCurrentFile(selectedFiles?.[0]);
        setProgress(0);
    };

    console.log(sharedValue);

    const upload = () => {
        setProgress(0);
        if (!currentFile) return;

        UploadService.upload(currentFile, (event: any) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setMessage(response.data.Message);
                onUpdate("Calendar");
                // return UploadService.getFiles();
            })
            // .then((files) => {
            //     setFileInfos(files.data);
            // })
            .catch((err) => {
                setProgress(0);

                if (err.response && err.response.data && err.response.data.message) {
                    setMessage(err.response.data.message);
                } else {
                    setMessage("Could not upload the File!");
                }

                setCurrentFile(undefined);
            });
    };
    useEffect(() => {
        UploadService.getFiles().then((response) => {
            setFileInfos(response.data);
            console.log(fileInfos);
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="row flex flex-col items-center justify-center">
                <div className="col-8 flex flex-col items-center justify-center">
                    <label className="btn btn-default p-0">
                        <input type="file" onChange={selectFile} />
                    </label>
                </div>

                <div className="col-4 flex flex-col items-center justify-center">
                    <button
                        className="btn btn-success btn-sm"
                        disabled={!currentFile}
                        onClick={upload}
                    >
                        Upload
                    </button>
                </div>
            </div>

            {currentFile && (
                <div className="progress my-3">
                    <div
                        className="progress-bar progress-bar-info"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )}

            {message && (
                <div className="alert alert-secondary mt-3 p-11" role="alert">
                    {message}
                </div>
            )}

            {/* <div className="card mt-3">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a href={file.url}>{file.name}</a>
                            </li>
                        ))}
                </ul>
            </div> */}
        </div>
    );
};

// export default FileUpload;