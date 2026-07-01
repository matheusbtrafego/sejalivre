import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('Família Seja Livre (Respostas).xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

console.log(JSON.stringify(data.slice(0, 2), null, 2));
