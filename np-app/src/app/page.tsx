"use client";

import { exec, spawn, fork } from "child_process";
import React, { useState } from "react";
import "./globals.css";
import { CalendarPage } from "../../components/CalendarPage";
import { FileUpload } from "../../components/FileUpload";


export default function Home() {
	const [sharedValue, setSharedValue] = useState<string>("");
	return (
		<main className="bg-zinc-900 h-screen">
			<FileUpload sharedValue={sharedValue} onUpdate={(newValue) => setSharedValue(newValue)} />
			<CalendarPage sharedValue={sharedValue} />
		</main>
	);
}
