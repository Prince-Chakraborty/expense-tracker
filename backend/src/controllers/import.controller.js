const { importFromCSV, importFromPDF } = require('../services/import.service');
const path = require('path');
const fs = require('fs');
const os = require('os');

const importExpenses = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const ext = path.extname(req.file.originalname).toLowerCase();
    const tmpPath = path.join(os.tmpdir(), Date.now() + ext);
    fs.writeFileSync(tmpPath, req.file.buffer);
    let result;
    if (ext === '.csv') {
      result = await importFromCSV(tmpPath, req.user.id);
    } else if (ext === '.pdf') {
      result = await importFromPDF(tmpPath, req.user.id);
    } else {
      return res.status(400).json({ message: 'Only CSV and PDF files are supported' });
    }
    return res.status(200).json({
      message: 'Successfully imported ' + result.imported + ' expenses',
      imported: result.imported,
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { importExpenses };