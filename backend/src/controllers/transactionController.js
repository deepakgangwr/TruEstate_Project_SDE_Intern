import * as transactionService from '../services/transactionService.js';

export const getTransactions = async (req, res) => {
  try {
    const result = await transactionService.fetchTransactions(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error processing transactions' 
    });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const options = await transactionService.fetchFilterOptions();
    res.status(200).json({ success: true, ...options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Could not load filter options' 
    });
  }
};

