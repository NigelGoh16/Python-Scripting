import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(request: Request, res: Response) {
	// const { text } = await request.json();
	const formData = await request.formData();
	const name = formData.get("name") as string;

	const CalendarPromise = new Promise((resolve, reject) => {
		let jsonString = "";
		exec(
			`source VPS/bin/activate && python3 Excel_Automation.py ${name}`,
			// `"C:/Program Files/Python310/python.exe" "C:/Users/Lenovo/Desktop/VPS/Python Repo/Excel_Automation.py" "${name}"`,
			(error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					reject(error);
				}
				const startMarker = "{\"c";
				const endMarker = "]}";
		(error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				reject(error);
			}
			const startMarker = '{\"c';
			const endMarker = "]}";

			const indexOfStart = stdout.indexOf(startMarker);
			const indexOfEnd = stdout.indexOf(endMarker, indexOfStart); // Search from indexOfStart

			if (indexOfStart !== -1 && indexOfEnd !== -1) {
				jsonString = stdout.slice(
					indexOfStart,
					indexOfEnd + 2
				);
			} else {
				console.error("Markers not found in the string");
			}
          	resolve(jsonString);
		}
		);
	});

	const CalendarStatus = await CalendarPromise;
	return NextResponse.json({ CalendarStatus });
}
