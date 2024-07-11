import { exec, spawn, fork } from "child_process";
import "./globals.css";
import { CalendarPage } from "../../components/CalendarPage";

export default function Home() {
	return (
		<main className="bg-zinc-900 h-screen">
			<CalendarPage />
		</main>
	);
}
