import * as xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const workbook = xlsx.readFile('Família Seja Livre (Respostas).xlsx', { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: "" }) as any[];

  console.log(`Lendo ${data.length} registros...`);

  const recordsToInsert = data.map(row => {
    let nascimento = null;
    if (row["Data de nascimento"]) {
      const d = row["Data de nascimento"];
      if (d instanceof Date) {
        nascimento = d.toISOString().split("T")[0];
      } else if (typeof d === "number") {
         const date = new Date((d - (25567 + 2)) * 86400 * 1000); 
         if (!isNaN(date.getTime())) {
           nascimento = date.toISOString().split("T")[0];
         }
      } else if (typeof d === "string") {
        nascimento = d; 
      }
    }

    return {
      nome: row["Nome"] || "Desconhecido",
      email: row["E-mail"] || null,
      telefone: row["Whatsapp"] ? String(row["Whatsapp"]) : null,
      data_nascimento: nascimento,
      status: "Visitante",
      papel: "MEMBRO"
    };
  });

  const { error } = await supabase.from('sl_membros').insert(recordsToInsert);

  if (error) {
    console.error("Erro ao inserir:", error);
  } else {
    console.log("Sucesso! Inseridos", recordsToInsert.length, "membros.");
  }
}

run();
