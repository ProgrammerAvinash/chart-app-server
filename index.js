import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 800;

app.use(express.json());
app.use(cors());
app.get("/data", async (req, res) => {
  try {
    const spreadsheetUrl =
      "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/export?format=csv";
    const response = await axios.get(spreadsheetUrl);

    // Split CSV data into rows
    const rows = response.data.split("\n");

    // Extract headers from the first row
    const headers = rows[0].split(",");

    // Extract data from subsequent rows and format as array of objects
    const formattedData = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      const obj = {
        Day: rowData[0].split("/").reverse().join("-"), // Format date as 'YYYY-MM-DD'
        Age: rowData[1],
        Gender: rowData[2],
        features: {
          A: rowData[3],
          B: rowData[4],
          C: rowData[5],
          D: rowData[6],
          E: rowData[7],
          F: rowData[8].trim(), // Remove any trailing whitespace
        },
      };
      formattedData.push(obj);
    }

    // Send the formatted data as JSON response
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
