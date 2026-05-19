const Tesseract = require("tesseract.js");
const User = require("../models/User");

const extractAadhaarData = async (req, res) => {

  try {

    const imagePath = req.file.path;

    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    const extractedText = result.data.text;
        // Extract Aadhaar Number
    const aadhaarMatch =
  extractedText.match(
    /\d{4}\s?\d{4}\s?\d{4}/
  );

    let aadhaarNumber = "Not Found";

if (aadhaarMatch) {

  // remove spaces
  const cleanNumber =
    aadhaarMatch[0]
      .replace(/\s/g, "");

  // format again
  aadhaarNumber =
    cleanNumber.replace(
      /(\d{4})(\d{4})(\d{4})/,
      "$1 $2 $3"
    );

}

    // Extract DOB
    const dobMatch =
      extractedText.match(
        /\d{2}\/\d{2}\/\d{4}/
      );

    const dob =
      dobMatch
        ? dobMatch[0]
        : "Not Found";

    // Extract Gender
    let gender = "Not Found";

    if (
      extractedText.includes("MALE")
    ) {
      gender = "MALE";
    }

    if (
      extractedText.includes("FEMALE")
    ) {
      gender = "FEMALE";
    }

    // Extract Name
    const lines =
      extractedText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    let name = "Not Found";

    for (let line of lines) {

  const cleanLine =
  line
    .replace(/[^A-Za-z\s]/g, "")
    .trim();

    const finalLine =
  cleanLine
    .replace(/^Name\s*/i, "")
    .trim();

const upperLine =
  cleanLine.toUpperCase();

  if (

    cleanLine.length > 5 &&

    !upperLine.includes("GOVERNMENT") &&
    !upperLine.includes("INDIA") &&
    !upperLine.includes("AUTHORITY") &&
    !upperLine.includes("AADHAAR") &&
    !upperLine.includes("DOB") &&
    !upperLine.includes("MALE") &&
    !upperLine.includes("FEMALE")&&

    !cleanLine.match(/\d/)

  ) {

    name = finalLine;
    break;

  }

}

    console.log(extractedText);

    const userId =
  req.user.id;

await User.findByIdAndUpdate(

  userId,

  {

    aadhaarName: name,

    aadhaarDOB: dob,

    aadhaarGender: gender,

    aadhaarNumber:
      aadhaarNumber

  }

);

    res.status(200).json({
  message: "OCR Extraction Success",

  extractedData: {
    name,
    dob,
    gender,
    aadhaarNumber
  },

  rawText: extractedText
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "OCR Failed"
    });

  }

};

const extractPanData =
  async (req, res) => {

    try {

      const imagePath =
        req.file.path;

      const result =
        await Tesseract.recognize(
          imagePath,
          "eng"
        );

      const extractedText =
        result.data.text;

      // Extract PAN Number
      const panMatch =
        extractedText.match(
          /[A-Z]{5}[0-9]{4}[A-Z]{1}/
        );

      const panNumber =
        panMatch
          ? panMatch[0]
          : "Not Found";

      // Extract DOB
      const dobMatch =
        extractedText.match(
          /\d{2}\/\d{2}\/\d{4}/
        );

      const dob =
        dobMatch
          ? dobMatch[0]
          : "Not Found";

      // Extract Name
        const lines =
  extractedText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

let name = "Not Found";

for (let i = 0; i < lines.length; i++) {

  const currentLine =
    lines[i].toUpperCase();

  // detect "NAME"
  if (
    currentLine.includes("NAME")
  ) {

    // next line usually contains actual name
    const nextLine =
      lines[i + 1];

    if (nextLine) {

      const cleanName =
  nextLine
    .replace(
      /[^A-Za-z\s]/g,
      ""
    )
    .replace(
      /\b[a-zA-Z]{1,2}\b/g,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();

      if (
        cleanName.length > 5
      ) {

        name = cleanName;

        break;

      }

    }

  }

}
const userId =
  req.user.id;
await User.findByIdAndUpdate(
  userId,
  {
    panName: name,
    panDOB: dob,
    panNumber:panNumber
  }
);

      res.status(200).json({

        message:
          "PAN OCR Success",

        extractedData: {
          name,
          dob,
          panNumber
        },

        rawText:
          extractedText

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "PAN OCR Failed"
      });

    }

};

module.exports = {
  extractAadhaarData,
  extractPanData
};