"use client";

import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
// import POST_file from "../src/app/services/fileupload";
import FileUpload from "./FileUpload";

export const CalendarPage = () => {
	const [BlobData, setBlob] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch("/Calendar", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const { CalendarStatus } = await res.json();
		setBlob(CalendarStatus);
		console.log(BlobData);
		var fileToSave = new Blob([BlobData], {
			type: 'application/json'
		});

		// Save the file
		saveAs(fileToSave, "Calendar.json");
	};
	return (
		// <div>
		// 	<FileUpload />
			
		// 	<form
		// 		onSubmit={handleSubmit}
		// 		className="flex flex-col items-center justify-center h-screen"
		// 		method="post" encType="multipart/form-data"
		// 	>
		// 		{/* <input name="file" type="file" multiple></input>
		// 		<button type="submit">Upload</button> */}
		// 		<div className="flex items-center justify-center  space-x-2">
		// 			{/* <input
		// 				type="text"
		// 				value={text}
		// 				onChange={(e) => setText(e.target.value)}
		// 				placeholder="Enter Text here..."
		// 				className="bg-transparent border border-white rounded-lg px-2 py-1 text-white"
		// 			/> */}
		// 			<button className="px-2 py-1 border rounded-lg bg-blue-500 hover:bg-blue-700 text-white">
		// 				Convert
		// 			</button>
		// 		</div>
		// 		{BlobData !== "" && (
		// 			<p className="mt-2 text-white">
		// 				Calendar BlobData : {BlobData}
		// 			</p>
		// 		)}
		// 	</form>
		// </div>
		<div className="flex flex-col items-center justify-center h-screen">
			<FileUpload />

			<form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full">
				<div className="flex items-center justify-center space-x-2">
					<button className="px-2 py-1 border rounded-lg bg-blue-500 hover:bg-blue-700 text-white">
						Convert
					</button>
				</div>
				{BlobData !== "" && (
					<p className="mt-2 text-white">
						Calendar BlobData : {BlobData}
					</p>
				)}
			</form>
		</div>
	);
};
