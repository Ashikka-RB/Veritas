const Tesseract = require("tesseract.js");

const extractAadhaarData = async (req, res) => {

  try {

    const imagePath = req.file.path;

    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    const extractedText = result.data.text;

    console.log(extractedText);

    res.status(200).json({
      message: "OCR Extraction Success",
      text: extractedText
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "OCR Failed"
    });

  }

};

module.exports = {
  extractAadhaarData
};