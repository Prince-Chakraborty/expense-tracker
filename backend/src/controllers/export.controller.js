const Expense = require('../models/expense.model');

const exportCSV = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      raw: true,
    });

    const header = 'id,title,amount,category,date,notes,isAnomaly\n';
    const rows = expenses.map(e =>
      `${e.id},"${e.title}",${e.amount},${e.category},${e.date},"${e.notes || ''}",${e.isAnomaly}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    return res.status(200).send(header + rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { exportCSV };