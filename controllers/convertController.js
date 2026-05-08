const Conversion = require("../models/Conversion");
const { validationResult } = require("express-validator");

const convertCurrency = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, from, to } = req.body;

    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.rates || !data.rates[to]) {
      return res.status(500).json({ message: "Conversion failed" });
    }

    const result = data.rates[to];

    const conversion = await Conversion.create({ from, to, amount, result });

    return res.status(201).json(conversion);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteConversion = async (req, res) => {
  const id = req.params.id;
  try {
    const conversion = await Conversion.findByIdAndDelete(id);
    if (!conversion) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find();
    res.json(conversions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { convertCurrency, deleteConversion, getConversions };
