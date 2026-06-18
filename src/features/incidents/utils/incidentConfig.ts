export interface TypeCfg {
    chipLabel: string;
    bg: string;
    text: string;
    border: string;
}

export const INCIDENT_TYPE_CONFIG: Record<string, TypeCfg> = {
    SHARED_PERSONAL_OR_BANKING_DATA: { chipLabel: "Datos bancarios", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    CLICKED_SUSPICIOUS_LINK:         { chipLabel: "Link sospechoso",  bg: "bg-sky-500/10",    text: "text-sky-400",    border: "border-sky-500/20"    },
    TRANSFERRED_MONEY:               { chipLabel: "Transferencia",    bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20"    },
    DOWNLOADED_FILE_OR_APP:          { chipLabel: "App o archivo",    bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    OTHER_NOT_SURE:                  { chipLabel: "Otro",             bg: "bg-slate-500/10",  text: "text-slate-400",  border: "border-slate-500/20"  },
};

export const BANK_STEP_KEYS = new Set([
    "BLOCK_CARD",
    "CONTACT_BANK_URGENTLY",
    "FILE_REPORT_BANK",
]);

export interface BankEntry { name: string; phone: string; }

export const BANK_CATALOG: BankEntry[] = [
    { name: "Banco Nación",    phone: "0800-666-4444" },
    { name: "Banco Provincia", phone: "0800-333-0001" },
    { name: "Santander",       phone: "0810-333-3333" },
    { name: "Galicia",         phone: "0810-555-4525" },
    { name: "BBVA",            phone: "0800-888-2282" },
    { name: "ICBC",            phone: "0800-345-4228" },
    { name: "Banco Macro",     phone: "0810-555-5000" },
    { name: "Supervielle",     phone: "0810-888-7889" },
    { name: "HSBC",            phone: "0810-888-4722" },
    { name: "Banco Ciudad",    phone: "0810-444-2484" },
    { name: "Patagonia",       phone: "0810-777-1330" },
    { name: "MercadoPago",     phone: "0800-555-0001" },
];

export function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR");
}

export function fmtTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateTime(iso: string): string {
    return `${fmtDate(iso)} - ${fmtTime(iso)}`;
}