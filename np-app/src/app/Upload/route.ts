import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

// Define the POST handler for the file upload
export const POST = async (req: Request, res: Response) => {
  // Parse the incoming form data
  const formData = await req.formData();

  // Get the file from the form data
  const file = formData.get("file") as File;

  const name = formData.get("name") as string;

  // Check if a file is received
  if (!file) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Replace spaces in the file name with underscores
  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(
      // path.join(process.cwd(), "public/assets/Calendar.xlsx"),
      // path.join(`C:/Users/Lenovo/Desktop/VPS/Python Repo/${name}.xlsx`),
      path.join(`/var/www/157.245.70.171/${name}.xlsx`),
      buffer
    );

    // Return a JSON response with a success message and a 201 status code
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
