import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET(request: Request) {
	// const { text } = await request.json();

	const CalendarPromise = new Promise((resolve, reject) => {
		exec(
			`python3 Excel_Automation.py`,
			// `"C:/Program Files/Python310/python.exe" Excel_Automation.py`,
			(error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					reject(error);
				}
				resolve(stdout);
			}
		);
	});

	const CalendarStatus = await CalendarPromise;
	return NextResponse.json({ CalendarStatus });
}
