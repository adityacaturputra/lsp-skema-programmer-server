const reader = require("xlsx");

module.exports = (records, sheetName = "sheet", format) => {
  const workBook = reader.utils.book_new();
  const workSheet = reader.utils.json_to_sheet(records);
  reader.utils.book_append_sheet(workBook, workSheet, sheetName);
  const wopts = { bookType: format || "xlsx", bookSST: false, type: "base64" };
  const buffer = reader.write(workBook, wopts);
  return buffer;
};
