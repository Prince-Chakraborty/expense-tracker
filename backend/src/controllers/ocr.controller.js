const { extractTextFromReceipt, autoCateggorize } = require('../services/ocr.service');
const Expense = require('../models/expense.model');
const fs = require('fs');

const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    const { extractedText, amount, title } = await extractTextFromReceipt(imagePath);
    const category = autoCateggorize(extractedText);

    fs.unlinkSync(imagePath);

    return res.status(200).json({
      message: 'Receipt scanned successfully',
      data: {
        title: title || 'Receipt Expense',
        amount: amount || 0,
        category,
        extractedText,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { scanReceipt };
