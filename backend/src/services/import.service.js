const csv = require('csv-parser');
const fs = require('fs');
const Expense = require('../models/expense.model');

const autoCateggorize = (title) => {
  const lowerText = title.toLowerCase();
  if (lowerText.match(/restaurant|food|cafe|pizza|burger|lunch|dinner|breakfast|swiggy|zomato/)) return 'food';
  if (lowerText.match(/uber|ola|taxi|metro|bus|petrol|fuel|transport/)) return 'transport';
  if (lowerText.match(/amazon|flipkart|shopping|mall|store|retail/)) return 'shopping';
  if (lowerText.match(/hospital|pharmacy|medical|doctor|health|clinic/)) return 'health';
  if (lowerText.match(/movie|netflix|spotify|entertainment|game/)) return 'entertainment';
  if (lowerText.match(/electricity|water|gas|internet|utility|bill/)) return 'utilities';
  return 'other';
};

const importFromCSV = async (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const expenses = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const amount = Math.min(parseFloat(row.amount || row.Amount || 0), 9999999.99);
        expenses.push({
          userId,
          title: (row.title || row.Title || 'Imported Expense').substring(0, 200),
          amount: isNaN(amount) ? 0 : amount,
          category: row.category || row.Category || autoCateggorize(row.title || ''),
          date: row.date || row.Date || new Date().toISOString().split('T')[0],
          notes: (row.notes || row.Notes || 'Imported from CSV').substring(0, 500),
        });
      })
      .on('end', async () => {
        try {
          await Expense.bulkCreate(expenses);
          try { fs.unlinkSync(filePath); } catch(e) {}
          resolve({ imported: expenses.length });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
};

const importFromPDF = async (filePath, userId) => {
  try {
    const pdf = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;
    const lines = text.split('\n').filter((line) => line.trim());

    const expenses = [];
    lines.forEach((line) => {
      const amountMatch = line.match(/[0-9]+(?:\.[0-9]{1,2})?/);
      if (amountMatch) {
        const amount = Math.min(parseFloat(amountMatch[0]), 9999999.99);
        if (amount > 0 && amount < 9999999.99) {
          expenses.push({
            userId,
            title: line.replace(/[0-9]+(?:\.[0-9]{1,2})?/, '').trim().substring(0, 200) || 'PDF Import',
            amount,
            category: autoCateggorize(line),
            date: new Date().toISOString().split('T')[0],
            notes: 'Imported from PDF',
          });
        }
      }
    });

    if (expenses.length > 0) {
      await Expense.bulkCreate(expenses);
    }
    fs.unlinkSync(filePath);
    return { imported: expenses.length };
  } catch (error) {
    throw new Error('PDF import failed: ' + error.message);
  }
};

module.exports = { importFromCSV, importFromPDF };