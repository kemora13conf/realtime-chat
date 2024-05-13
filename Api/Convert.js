import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the JSON file
fs.readFile(path.join(__dirname, './Models/default-image.json'), (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const imageData = JSON.parse(data);

    // Convert the base64 encoded buffer back to a Buffer object
    const buffer = Buffer.from(imageData.data, "base64");

    // Write the buffer to a new file
    fs.writeFile(imageData.fileName, buffer, (err) => {
      if (err) {
        console.error("Error writing image file:", err);
        return;
      }
      console.log("Image created successfully:", imageData.fileName);
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
