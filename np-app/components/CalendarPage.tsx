"use client";

import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import http from "../src/app/http-common";
// import POST_file from "../src/app/services/fileupload";
import "../src/app/globals.css";

export const CalendarPage: React.FC<{ sharedValue: string }> = ({ sharedValue }) => {
	const [BlobData, setBlob] = useState("");
	let formData = new FormData();

	formData.append("name", sharedValue);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// const res = await fetch("/Calendar", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// });
		const res = await http.post("/Calendar", formData, {
			headers: {
				"Content-Type": "application/json",
			}
		});
		const { CalendarStatus } = await res.data;

		let textToSave = "";
		if (typeof CalendarStatus !== 'string') {
			textToSave = JSON.stringify(CalendarStatus); // Convert object to string
		} else {
			textToSave = CalendarStatus; // Already a string, use it directly
		}

		setBlob(textToSave); // Update the Blob state with the text content
		console.log(sharedValue, textToSave); // Log the text content

		var fileToSave = new Blob([textToSave], {
			type: 'text/plain' // Set the content type to plain text
		});

		// Save the file as a txt file
		saveAs(fileToSave, `${sharedValue}.txt`);

		// const { CalendarStatus } = await res.json();
		// setBlob(CalendarStatus);

		// console.log(sharedValue, BlobData);
		// var fileToSave = new Blob([CalendarStatus], {
		// 	type: 'application/json'
		// });

		// // Save the file
		// saveAs(fileToSave, `${sharedValue}.json`);
	};
	return (
		<div className="flex flex-col items-center justify-center">
			<form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full">
				<div className="flex items-center justify-center space-x-2">
					<button className="px-2 py-1 border rounded-lg bg-blue-500 hover:bg-blue-700 text-white">
						Convert
					</button>
				</div>
				{BlobData !== "" && (
					<p className="mt-2 text-white">
						Calendar BlobData :
					</p>
				)}
				{BlobData !== "" && (
					<pre className=" whitespace-pre-wrap"><p className="whitespace-pre-wrap">{JSON.stringify(BlobData, null, 2)}</p></pre>
				)}
			</form>
		</div>
	);
};
