const { TextractClient, AnalyzeDocumentCommand } = require('@aws-sdk/client-textract');
const fs = require('fs');
require('dotenv').config();

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const extractTextFromReceipt = async (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: imageBuffer },
      FeatureTypes: ['FORMS'],
    });

    const response = await textractClient.send(command);

    const extractedText = response.Blocks
      .filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join('\n');

    const amount = extractAmount(extractedText);
    const title = extractTitle(extractedText);

    return { extractedText, amount, title };
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message);
  }
};

const extractAmount = (text) => {
  const amountRegex = /(?:total|amount|grand total|subtotal)[:\s]*[$₹]?\s*(\d+(?:\.\d{2})?)/i;
  const match = text.match(amountRegex);
  if (match) return parseFloat(match[1]);
  const numberRegex = /[$₹]\s*(\d+(?:\.\d{2})?)/;
  const numberMatch = text.match(numberRegex);
  return numberMatch ? parseFloat(numberMatch[1]) : null;
};

const extractTitle = (text) => {
  const lines = text.split('\n').filter((line) => line.trim());
  return lines[0] || 'Receipt Expense';
};

const autoCateggorize = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/restaurant|food|cafe|pizza|burger|lunch|dinner|breakfast/)) return 'food';
  if (lowerText.match(/uber|ola|taxi|metro|bus|petrol|fuel|transport/)) return 'transport';
  if (lowerText.match(/amazon|flipkart|shopping|mall|store|retail/)) return 'shopping';
  if (lowerText.match(/hospital|pharmacy|medical|doctor|health|clinic/)) return 'health';
  if (lowerText.match(/movie|netflix|spotify|entertainment|game/)) return 'entertainment';
  if (lowerText.match(/electricity|water|gas|internet|utility|bill/)) return 'utilities';
  return 'other';
};

module.exports = { extractTextFromReceipt, autoCateggorize };
