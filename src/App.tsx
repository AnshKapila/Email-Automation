import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode2, 
  FileText, 
  Settings, 
  Table, 
  Check, 
  Copy, 
  Download, 
  BookOpen, 
  Plus, 
  Trash2, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Undo2,
  FileSpreadsheet,
  Play
} from 'lucide-react';
import JSZip from 'jszip';

// Define the structure of a single Lead
interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  role: string;
  phone: string;
  location: string;
  category: string;
}

// Initial fake leads matching the CSV schema
const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.j@techstart.io',
    company_name: 'TechStart',
    role: 'VP of Growth',
    phone: '+1-555-0100',
    location: 'San Francisco',
    category: 'Fintech'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Kovacs',
    email: 'mkovacs@designlabs.co',
    company_name: 'DesignLabs',
    role: 'Creative Director',
    phone: '+1-555-0144',
    location: 'New York',
    category: 'Creative Agency'
  },
  {
    id: '3',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'erostova@healthpulse.com',
    company_name: 'HealthPulse',
    role: 'Head of Product',
    phone: '+1-555-0188',
    location: 'Boston',
    category: 'Healthcare'
  }
];

const DEFAULT_TEMPLATE = `Subject: Custom Design Partnership with [COMPANY_NAME]

Hi [FIRST_NAME],

I hope this email finds you well. I came across your profile and noticed you are working as a [ROLE] at [COMPANY_NAME]. 

Here at Intent Studios, we specialize in high-impact product design and branding for companies in [LOCATION]. We noticed your company's incredible focus on the [CATEGORY] sector, and we would love to help you elevate your visual identity.

Would you be open to a quick 10-minute call next Tuesday at 2 PM to explore some fresh design ideas for [COMPANY_NAME]?

Best regards,

Creative Team
Intent Studios
www.intentstudios.com
Phone: +1 555-0199`;

const PYTHON_SCRIPT_CODE = `# -*- coding: utf-8 -*-
"""
Intent Studios - Cold Email Automation Tool (Version 1)
-------------------------------------------------------
This Python script automates the process of sending personalized cold emails 
to prospective design leads. It reads lead details from a CSV file, merges 
them into a text template using placeholders, sends the email securely via SSL, 
and logs the outcome of each attempt in a results spreadsheet.

Requirements:
- A secure SMTP email account (e.g., smtp.titan.email)
- Python 3 installed on your computer
"""

import csv
import os
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==========================================
# CONFIGURATION AND FILE PATHS
# ==========================================

# Path to the credentials file (Line 1: Email, Line 2: Password)
CONFIG_FILE = "config.txt"

# Path to your list of prospective clients
LEADS_FILE = "leads.csv"

# Path to your personalized email template
TEMPLATE_FILE = os.path.join("templates", "template_1.txt")

# Folder and file name where results are saved
RESULTS_DIR = "results"
RESULTS_FILE = os.path.join(RESULTS_DIR, "results.csv")

# SMTP Server details for Titan Mail
SMTP_SERVER = "smtp.titan.email"
SMTP_PORT = 465  # Standard port for secure SSL connections

# Delay in seconds between emails to comply with anti-spam limits
DELAY_SECONDS = 5


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def load_config():
    """
    Reads the sender email and password from 'config.txt'.
    This avoids hardcoding sensitive credentials inside the code.
    """
    if not os.path.exists(CONFIG_FILE):
        raise FileNotFoundError(
            f"The configuration file '{CONFIG_FILE}' is missing!\\n"
            f"Please create a file named '{CONFIG_FILE}' in the same folder as this script.\\n"
            f"Line 1 should be your email address, and Line 2 should be your password."
        )
    
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        # Read lines and strip any leading/trailing spaces or newlines
        lines = [line.strip() for line in f.readlines()]
    
    # Check if we have at least 2 lines (email and password)
    if len(lines) < 2 or not lines[0] or not lines[1]:
        raise ValueError(
            f"The '{CONFIG_FILE}' file must contain exactly two lines:\\n"
            f"Line 1: Your full email address (e.g., hello@intentstudios.com)\\n"
            f"Line 2: Your password or app password"
        )
    
    return lines[0], lines[1]


def load_template():
    """
    Reads the raw plain text of the email template from templates/template_1.txt.
    """
    if not os.path.exists(TEMPLATE_FILE):
        raise FileNotFoundError(
            f"The template file is missing at: {TEMPLATE_FILE}\\n"
            f"Please create the 'templates' folder and place 'template_1.txt' inside it."
        )
    
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return f.read()


def personalize_message(template_text, lead_data):
    """
    Scans the email template text for placeholders inside square brackets
    and replaces them with the actual values from the lead's row in the CSV.
    """
    personalized_text = template_text
    
    # Loop through each column (key) and value in the lead's row
    for column_name, value in lead_data.items():
        # Placeholders are uppercase inside square brackets: [COLUMN_NAME]
        placeholder = f"[{column_name.upper()}]"
        
        # Replace all occurrences of this placeholder with the actual value
        personalized_text = personalized_text.replace(placeholder, str(value))
        
    return personalized_text


# ==========================================
# MAIN EXECUTION CORE
# ==========================================

def main():
    print("============================================================")
    print("      INTENT STUDIOS - COLD EMAIL AUTOMATION SYSTEM V1      ")
    print("============================================================")
    
    # --- Step 1: Load Credentials ---
    try:
        sender_email, sender_password = load_config()
        print(f"[*] Successfully loaded credentials for: {sender_email}")
    except Exception as e:
        print(f"[ERROR] Failed to load credentials from '{CONFIG_FILE}':\\n  {e}")
        print("\\nStopping script. Please fix the error above and try again.")
        return

    # --- Step 2: Load Email Template ---
    try:
        template_text = load_template()
        print("[*] Successfully loaded 'templates/template_1.txt'")
    except Exception as e:
        print(f"[ERROR] Failed to load the template file:\\n  {e}")
        print("\\nStopping script. Please fix the error above and try again.")
        return

    # --- Step 3: Load Lead CSV File ---
    if not os.path.exists(LEADS_FILE):
        print(f"[ERROR] Leads file '{LEADS_FILE}' not found!")
        print("Please ensure you have placed your 'leads.csv' in the same folder as this script.")
        return

    leads = []
    fieldnames = []
    
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            leads.append(row)

    if not leads:
        print(f"[WARNING] No leads found in '{LEADS_FILE}'. The file is empty.")
        return

    print(f"[*] Loaded {len(leads)} leads from '{LEADS_FILE}'.")
    print("[*] Connecting to SMTP mail server...")
    print("-" * 60)

    # Make sure the results directory exists
    os.makedirs(RESULTS_DIR, exist_ok=True)

    # Variables to track progress and stats
    results_list = []
    total_sent = 0
    total_failed = 0

    # --- Step 4: Establish SMTP SSL Connection ---
    server = None
    try:
        # smtp.titan.email requires an SSL connection at port 465
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        
        # Log in to the mail server
        server.login(sender_email, sender_password)
        print("[*] SMTP Authentication successful. Ready to send emails.")
        print("-" * 60)
    except Exception as e:
        print(f"[CRITICAL ERROR] Failed to connect/login to SMTP server:\\n  {e}")
        print("\\nSuggestions:")
        print("1. Double-check your email address and password in 'config.txt'")
        print("2. Ensure your computer is connected to the internet")
        print("3. Check if your mail provider requires an 'App Password'")
        return

    # --- Step 5: Process and Send Email to Each Lead ---
    try:
        for index, lead in enumerate(leads, 1):
            email_to = lead.get("email", "").strip()
            first_name = lead.get("first_name", "").strip()
            company_name = lead.get("company_name", "").strip()
            
            print(f"[{index}/{len(leads)}] Preparing email for: {first_name} at {company_name}")
            
            # Basic validation check
            if not email_to or "@" not in email_to:
                print(f"  -> [FAILED] Invalid or missing email address: '{email_to}'")
                lead["status"] = "FAILED"
                results_list.append(lead)
                total_failed += 1
                continue

            # Merge lead data into the template
            full_personalized_email = personalize_message(template_text, lead)
            
            # Separate the Subject and Body from the template
            subject = f"Design Inquiry for {company_name}"
            body_content = full_personalized_email
            
            if full_personalized_email.strip().lower().startswith("subject:"):
                parts = full_personalized_email.split("\\n", 1)
                subject_line = parts[0]
                subject = subject_line[8:].strip()
                body_content = parts[1].strip() if len(parts) > 1 else ""

            # Prepare the MIME email structure
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = email_to
            msg['Subject'] = subject
            msg.attach(MIMEText(body_content, 'plain', 'utf-8'))

            # Send the email and handle failures safely
            try:
                server.sendmail(sender_email, email_to, msg.as_string())
                print(f"  -> [SUCCESS] Email sent to <{email_to}>")
                lead["status"] = "SENT"
                total_sent += 1
            except Exception as email_err:
                print(f"  -> [FAILED] Could not send to <{email_to}>. Error details:")
                print(f"     {email_err}")
                lead["status"] = "FAILED"
                total_failed += 1
            
            results_list.append(lead)

            # Delay to comply with anti-spam limits
            if index < len(leads):
                print(f"  -> Waiting {DELAY_SECONDS} seconds before the next email...")
                time.sleep(DELAY_SECONDS)

    finally:
        # --- Step 6: Safely Close SMTP Connection ---
        if server:
            try:
                server.quit()
                print("[-] Closed SMTP mail server connection.")
            except Exception:
                pass

    # --- Step 7: Save Outcomes to results/results.csv ---
    new_headers = list(fieldnames) + ["status"]
    try:
        with open(RESULTS_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=new_headers)
            writer.writeheader()
            writer.writerows(results_list)
        print("-" * 60)
        print(f"[*] Results successfully saved to: {RESULTS_FILE}")
    except Exception as csv_err:
        print(f"[ERROR] Could not save results to '{RESULTS_FILE}':\\n  {csv_err}")

    # --- Step 8: Print Summary to Console ---
    print("-" * 60)
    print("               CAMPAIGN EXECUTION SUMMARY")
    print("-" * 60)
    print(f"  Total Leads Processed : {len(leads)}")
    print(f"  Emails Successfully Sent   : {total_sent}")
    print(f"  Emails Failed / Skipped: {total_failed}")
    print("============================================================")
    print("Automation complete! Check results/results.csv for logs.")


if __name__ == "__main__":
    main()`;

export default function App() {
  // Folder navigation state
  const [activeFile, setActiveFile] = useState<string>('send_emails.py');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  
  // Application credentials state
  const [email, setEmail] = useState<string>('hello@intentstudios.com');
  const [password, setPassword] = useState<string>('your_titan_email_password_here');
  
  // Leads Database state
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  
  // Lead form state (for adding a new lead)
  const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    role: '',
    phone: '',
    location: '',
    category: ''
  });

  // Template editor state
  const [templateText, setTemplateText] = useState<string>(DEFAULT_TEMPLATE);
  const [templateTab, setTemplateTab] = useState<'edit' | 'preview'>('edit');
  const [previewLeadId, setPreviewLeadId] = useState<string>('1');

  // Leads representation tab (Spreadsheet vs Raw CSV text)
  const [leadsTab, setLeadsTab] = useState<'grid' | 'raw'>('grid');

  // Interactive guide steps state
  const [guideStep, setGuideStep] = useState<number>(1);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Terminal Simulator state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [simIndex, setSimIndex] = useState<number>(0);

  // Helper to show brief notifications
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Convert current leads table state into raw CSV text representation
  const rawCSVContent = useMemo(() => {
    const headers = 'first_name,last_name,email,company_name,role,phone,location,category';
    const rows = leads.map(l => [
      l.first_name,
      l.last_name,
      l.email,
      l.company_name,
      l.role,
      l.phone,
      l.location,
      l.category
    ].map(val => {
      const cleanVal = (val || '').replace(/"/g, '""');
      return cleanVal.includes(',') || cleanVal.includes('"') || cleanVal.includes('\n')
        ? `"${cleanVal}"`
        : cleanVal;
    }).join(','));
    return [headers, ...rows].join('\n');
  }, [leads]);

  // Handle parsing pasted CSV raw text back to the spreadsheet grid
  const handleCSVChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = text.split('\n');
    if (lines.length <= 1) {
      setLeads([]);
      return;
    }
    
    // Grab headers
    const headers = lines[0].split(',').map(h => h.trim());
    const validHeaders = ['first_name', 'last_name', 'email', 'company_name', 'role', 'phone', 'location', 'category'];
    
    // Rough validation
    const headerMatch = headers.every(h => validHeaders.includes(h));
    if (!headerMatch) {
      // Just try mapping indices if headers differ slightly
    }

    const parsedLeads: Lead[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Basic CSV splitter that handles quotes nicely
      const values: string[] = [];
      let currentVal = '';
      let inQuotes = false;
      
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim());
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());

      const obj: any = { id: String(i) };
      validHeaders.forEach((key, colIdx) => {
        obj[key] = values[colIdx] || '';
      });
      parsedLeads.push(obj as Lead);
    }
    
    setLeads(parsedLeads);
    if (parsedLeads.length > 0) {
      setPreviewLeadId(parsedLeads[0].id);
    }
  };

  // Insert key placeholder into the template at the current cursor position
  const insertPlaceholder = (key: string) => {
    const placeholder = `[${key.toUpperCase()}]`;
    const textarea = document.getElementById('template-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = templateText.substring(0, start) + placeholder + templateText.substring(end);
      setTemplateText(newText);
      // Focus back and place cursor after the placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 50);
      triggerNotification(`Inserted placeholder: ${placeholder}`, 'info');
    } else {
      setTemplateText(prev => prev + ' ' + placeholder);
    }
  };

  // Helper to generate the real-time merged email content
  const mergedPreview = useMemo(() => {
    const activeLead = leads.find(l => l.id === previewLeadId) || leads[0];
    if (!activeLead) return 'No leads available to preview.';

    let output = templateText;
    const placeholderKeys: (keyof Omit<Lead, 'id'>)[] = [
      'first_name', 'last_name', 'email', 'company_name', 'role', 'phone', 'location', 'category'
    ];

    placeholderKeys.forEach(key => {
      const placeholder = `[${key.toUpperCase()}]`;
      const val = activeLead[key] || '';
      // We wrap the merged values in a visual tag span during rendering if we want,
      // but for raw rendering we can do standard string replace.
      output = output.replace(new RegExp('\\' + placeholder, 'g'), val);
    });

    return output;
  }, [templateText, leads, previewLeadId]);

  // Handle adding a new row to our leads spreadsheet
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.first_name || !newLead.email || !newLead.company_name) {
      triggerNotification('First Name, Email, and Company Name are required!', 'info');
      return;
    }
    const id = String(Date.now());
    const added: Lead = { id, ...newLead };
    setLeads(prev => [...prev, added]);
    setPreviewLeadId(id);
    // Reset form
    setNewLead({
      first_name: '',
      last_name: '',
      email: '',
      company_name: '',
      role: '',
      phone: '',
      location: '',
      category: ''
    });
    triggerNotification(`Successfully added lead: ${added.first_name}`);
  };

  const deleteLead = (id: string) => {
    const filtered = leads.filter(l => l.id !== id);
    setLeads(filtered);
    if (previewLeadId === id && filtered.length > 0) {
      setPreviewLeadId(filtered[0].id);
    }
    triggerNotification('Lead removed from campaign list.', 'info');
  };

  const updateLeadField = (id: string, field: keyof Lead, val: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  // Handle Copy to Clipboard for code views
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    triggerNotification(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Trigger JSZip generation and download in one single click!
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      
      // 1. send_emails.py
      zip.file("send_emails.py", PYTHON_SCRIPT_CODE);
      
      // 2. config.txt
      const configText = `${email.trim()}\n${password.trim()}\n`;
      zip.file("config.txt", configText);
      
      // 3. leads.csv
      zip.file("leads.csv", rawCSVContent);
      
      // 4. templates/template_1.txt
      const templatesDir = zip.folder("templates");
      if (templatesDir) {
        templatesDir.file("template_1.txt", templateText);
      }
      
      // 5. empty results/ folder placeholder
      const resultsDir = zip.folder("results");
      if (resultsDir) {
        resultsDir.file(".gitkeep", "# Placeholder to ensure results/ folder remains present\n");
      }
      
      // Generate the browser binary blob
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "intent-studios-cold-email-suite.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      triggerNotification("Download started! Extract the ZIP and run send_emails.py");
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to generate ZIP bundle", "info");
    }
  };

  // Run a visual command-line simulation inside the browser
  const runTerminalSimulation = () => {
    if (leads.length === 0) {
      triggerNotification("Add at least 1 lead to run the terminal simulation!", "info");
      return;
    }
    setIsSimulating(true);
    setSimulatedLogs([]);
    
    const logs = [
      `C:\\Users\\IntentStudios\\Desktop\\cold-email-tool> python send_emails.py`,
      `============================================================`,
      `      INTENT STUDIOS - COLD EMAIL AUTOMATION SYSTEM V1      `,
      `============================================================`,
      `[*] Successfully loaded credentials for: ${email}`,
      `[*] Successfully loaded 'templates/template_1.txt'`,
      `[*] Loaded ${leads.length} leads from 'leads.csv'.`,
      `[*] Connecting to SMTP mail server...`,
      `------------------------------------------------------------`,
      `[*] SMTP Authentication successful. Ready to send emails.`,
      `------------------------------------------------------------`
    ];

    leads.forEach((lead, i) => {
      const num = i + 1;
      logs.push(`[${num}/${leads.length}] Preparing email for: ${lead.first_name} at ${lead.company_name}`);
      if (!lead.email || !lead.email.includes('@')) {
        logs.push(`  -> [FAILED] Invalid or missing email address: '${lead.email}'`);
      } else {
        logs.push(`  -> [SUCCESS] Email sent to <${lead.email}>`);
      }
      if (num < leads.length) {
        logs.push(`  -> Waiting 5 seconds before the next email...`);
      }
    });

    logs.push(`------------------------------------------------------------`);
    logs.push(`[-] Closed SMTP mail server connection.`);
    logs.push(`------------------------------------------------------------`);
    logs.push(`[*] Results successfully saved to: results/results.csv`);
    logs.push(`------------------------------------------------------------`);
    logs.push(`               CAMPAIGN EXECUTION SUMMARY`);
    logs.push(`------------------------------------------------------------`);
    logs.push(`  Total Leads Processed : ${leads.length}`);
    logs.push(`  Emails Successfully Sent   : ${leads.filter(l => l.email && l.email.includes('@')).length}`);
    logs.push(`  Emails Failed / Skipped: ${leads.filter(l => !l.email || !l.email.includes('@')).length}`);
    logs.push(`============================================================`);
    logs.push(`Automation complete! Check results/results.csv for logs.`);
    logs.push(`C:\\Users\\IntentStudios\\Desktop\\cold-email-tool> `);

    // Render line-by-line using a staggered interval to look like a real terminal
    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setSimulatedLogs(prev => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* GLOBAL TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="font-medium text-xs font-mono">{notification.message}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="border-b border-zinc-800 bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-30 px-8 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-100 text-zinc-950 rounded-md flex items-center justify-center font-bold text-xs tracking-wider font-mono shadow-sm">
            IS
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-3">
              Intent Studios <span className="text-[10px] tracking-widest font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">AUTOMATION V1.0</span>
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">Cold Email Campaign Suite & Automation Studio</p>
          </div>
        </div>

        {/* BUNDLE DOWNLOAD BUTTON */}
        <button 
          onClick={handleDownloadZip}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 duration-150 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
          <span>Download Script Bundle</span>
        </button>
      </header>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* SIDEBAR FILE NAVIGATOR */}
        <section className="w-full lg:w-72 bg-[#09090b] border-r border-zinc-800 flex flex-col">
          <div className="p-5 border-b border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase font-mono mb-2.5">Workspace Files</p>
            <div className="flex items-center gap-2.5 bg-zinc-900/40 px-3.5 py-2 rounded-md border border-zinc-800">
              <FolderOpen className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-xs font-mono text-zinc-300">cold-email-tool/</span>
            </div>
          </div>

          <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {/* FILE: send_emails.py */}
            <button
              onClick={() => setActiveFile('send_emails.py')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left text-xs font-mono transition-all duration-150 group ${
                activeFile === 'send_emails.py' 
                  ? 'bg-zinc-900 text-[#fafafa] border border-zinc-800 font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode2 className={`w-4 h-4 ${activeFile === 'send_emails.py' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                <span>send_emails.py</span>
              </div>
              <span className="text-[10px] bg-zinc-850/50 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 font-sans font-medium">py</span>
            </button>

            {/* FILE: config.txt */}
            <button
              onClick={() => setActiveFile('config.txt')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left text-xs font-mono transition-all duration-150 group ${
                activeFile === 'config.txt' 
                  ? 'bg-zinc-900 text-[#fafafa] border border-zinc-800 font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${activeFile === 'config.txt' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                <span>config.txt</span>
              </div>
              <span className="text-[10px] bg-zinc-850/50 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 font-sans font-medium">conf</span>
            </button>

            {/* FILE: leads.csv */}
            <button
              onClick={() => setActiveFile('leads.csv')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left text-xs font-mono transition-all duration-150 group ${
                activeFile === 'leads.csv' 
                  ? 'bg-zinc-900 text-[#fafafa] border border-zinc-800 font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Table className={`w-4 h-4 ${activeFile === 'leads.csv' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                <span>leads.csv</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-sans font-medium">{leads.length} rows</span>
            </button>

            {/* FOLDER: templates/ */}
            <div className="pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1 text-xs font-mono text-zinc-500">
                <Folder className="w-3.5 h-3.5" />
                <span>templates/</span>
              </div>
              <div className="pl-3 mt-1 space-y-1">
                {/* FILE: template_1.txt */}
                <button
                  onClick={() => setActiveFile('template_1.txt')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs font-mono transition-all duration-150 group ${
                    activeFile === 'template_1.txt' 
                      ? 'bg-zinc-900 text-[#fafafa] border border-zinc-800 font-semibold' 
                      : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${activeFile === 'template_1.txt' ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                    <span>template_1.txt</span>
                  </div>
                </button>
              </div>
            </div>

            {/* FOLDER: results/ */}
            <div className="pt-3 border-t border-zinc-800/60 mt-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono text-zinc-500">
                <Folder className="w-3.5 h-3.5" />
                <span>results/ (out)</span>
              </div>
            </div>

            {/* USER GUIDE NAV */}
            <div className="pt-4 border-t border-zinc-800 mt-4 px-1.5 space-y-1.5">
              <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase font-mono px-3 mb-1.5">Documentation</p>
              <button
                onClick={() => setActiveFile('guide')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-xs transition-all duration-150 group ${
                  activeFile === 'guide' 
                    ? 'bg-zinc-900 text-[#fafafa] border border-zinc-800 font-semibold' 
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span className="font-medium">Setup Guide</span>
              </button>
            </div>
          </div>

          {/* SCRIPT SHORTCUT AD CARD */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 m-4 rounded-lg space-y-3.5">
            <div className="flex items-center gap-2 text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono">Simulation Sandbox</h4>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Test how the SMTP script loops over active leads. Runs purely client-side inside the simulated CLI.
            </p>
            <button
              onClick={() => {
                setActiveFile('terminal');
                runTerminalSimulation();
              }}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-900 text-zinc-200 text-xs py-2 rounded-md font-semibold border border-zinc-800 transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Launch Simulator</span>
            </button>
          </div>
        </section>

        {/* DYNAMIC CODE WORKSPACE AND EDITORS */}
        <section className="flex-1 bg-[#09090b] flex flex-col overflow-y-auto">
          
          {/* FILE PATH BREADCRUMB */}
          <div className="px-8 py-3.5 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">cold-email-tool</span>
              <span className="text-zinc-600">/</span>
              {activeFile === 'template_1.txt' && <span className="text-zinc-600">templates /</span>}
              <span className="text-zinc-100 font-semibold">{activeFile === 'guide' ? 'Windows Setup Guide' : activeFile === 'terminal' ? 'Python Terminal Simulator' : activeFile}</span>
            </div>
            
            {/* Quick Action bar depending on file */}
            {activeFile === 'send_emails.py' && (
              <button 
                onClick={() => copyToClipboard(PYTHON_SCRIPT_CODE, 'Python script')}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-all bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-800 text-xs font-sans cursor-pointer font-medium"
              >
                {copiedFile === 'Python script' ? <Check className="w-3.5 h-3.5 text-zinc-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                <span>{copiedFile === 'Python script' ? 'Copied' : 'Copy Code'}</span>
              </button>
            )}
          </div>

          {/* DYNAMIC COMPONENT LOADER */}
          <div className="p-8 flex-1 flex flex-col">
            
            {/* VIEW: send_emails.py */}
            {activeFile === 'send_emails.py' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/80">
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-200 mb-2 flex items-center gap-2 uppercase font-mono">
                    <FileCode2 className="w-4.5 h-4.5 text-zinc-400" />
                    Core Python Engine
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                    This is your custom cold-email automation engine. On your computer, it runs directly with Python 3, reading <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 text-[11px]">leads.csv</code> and personalization templates from <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 text-[11px]">templates/template_1.txt</code>. Then, it initiates a secure SSL socket to your SMTP relay to process your client leads sequentially.
                  </p>
                </div>

                {/* SCRIPT CODE VIEWER */}
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col relative group min-h-[400px]">
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <button 
                      onClick={() => copyToClipboard(PYTHON_SCRIPT_CODE, 'Python script')}
                      className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all shadow-sm cursor-pointer"
                      title="Copy Script Code"
                    >
                      {copiedFile === 'Python script' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <span className="ml-2">send_emails.py</span>
                    </div>
                  </div>
                  <pre className="p-4 overflow-auto text-xs font-mono text-slate-300 flex-1 leading-relaxed max-h-[500px]">
                    <code>{PYTHON_SCRIPT_CODE}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* VIEW: config.txt */}
            {activeFile === 'config.txt' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/80 space-y-3">
                  <h3 className="text-xs font-bold tracking-widest text-zinc-100 flex items-center gap-2 uppercase font-mono">
                    <Settings className="w-4.5 h-4.5 text-zinc-400" />
                    config.txt Workspace
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Rather than hardcoding your private email details inside the Python script (which is highly insecure), the script reads credentials from a simple plain-text configuration file called <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 text-[11px]">config.txt</code>. 
                  </p>
                  <p className="text-[11px] text-zinc-500 italic">
                    Note: Your details here will be bundled directly into the config.txt download below.
                  </p>
                </div>

                {/* EDITABLE FIELDS */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 space-y-5">
                  <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-mono">Customize Credentials</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-wide text-zinc-400 uppercase font-mono">Sender Email Address (Line 1)</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                        placeholder="hello@intentstudios.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-wide text-zinc-400 uppercase font-mono">Sender Password (Line 2)</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                        placeholder="your_titan_email_password_here"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400 leading-normal flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-200 block font-bold uppercase tracking-wider text-[10px] font-mono mb-1">Important Titan Mail Advice:</strong> If you have Two-Factor Authentication (2FA) enabled on Titan Mail, your standard account password might not connect. You should generate an <strong>App Password</strong> in your Titan Webmail settings and paste it here instead.
                    </div>
                  </div>
                </div>

                {/* PHYSICAL FILE REPRESENTATION */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-800 text-[11px] font-mono text-zinc-500">
                    Live Representation of <code className="text-zinc-300 font-semibold">config.txt</code>
                  </div>
                  <div className="p-5 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1.5 select-all">
                    <div>{email || 'hello@intentstudios.com'}</div>
                    <div className="text-zinc-500">•••••••••••••••••••• (masked for security - resolves to your password)</div>
                  </div>
                  <div className="bg-zinc-900/20 p-4 px-5 flex justify-between items-center border-t border-zinc-800">
                    <span className="text-[11px] text-zinc-500 font-mono">Exactly 2 lines of unformatted text. No extra spacing.</span>
                    <button 
                      onClick={() => copyToClipboard(`${email}\n${password}\n`, 'config.txt')}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-all bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-3.5 py-1.5 rounded font-medium cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy raw content</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: leads.csv */}
            {activeFile === 'leads.csv' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-zinc-100 flex items-center gap-2 uppercase font-mono">
                      <Table className="w-4.5 h-4.5 text-zinc-400" />
                      leads.csv Campaign List
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mt-1.5">
                      Build your target spreadsheet. Our Python script parses each column dynamically, letting you use column headers as placeholders like <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 font-mono text-[11px]">[FIRST_NAME]</code> in your template.
                    </p>
                  </div>
                  
                  {/* TAB TOGGLES */}
                  <div className="flex bg-zinc-950 p-1 rounded border border-zinc-800 self-start sm:self-center shrink-0">
                    <button 
                      onClick={() => setLeadsTab('grid')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        leadsTab === 'grid' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      Grid Editor
                    </button>
                    <button 
                      onClick={() => setLeadsTab('raw')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        leadsTab === 'raw' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Raw CSV Text
                    </button>
                  </div>
                </div>

                {/* SPREADSHEET GRID VIEW */}
                {leadsTab === 'grid' && (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40 flex-1 min-h-[250px] overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-zinc-950 text-zinc-400 font-mono border-b border-zinc-800 text-[10px] uppercase tracking-wider">
                            <th className="p-4 font-bold">first_name</th>
                            <th className="p-4 font-bold">last_name</th>
                            <th className="p-4 font-bold">email</th>
                            <th className="p-4 font-bold">company_name</th>
                            <th className="p-4 font-bold">role</th>
                            <th className="p-4 font-bold">phone</th>
                            <th className="p-4 font-bold">location</th>
                            <th className="p-4 font-bold">category</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-zinc-300">
                          {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-zinc-900/30 transition-colors">
                              <td className="p-1">
                                <input 
                                  value={lead.first_name} 
                                  onChange={(e) => updateLeadField(lead.id, 'first_name', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full font-semibold text-zinc-200 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.last_name} 
                                  onChange={(e) => updateLeadField(lead.id, 'last_name', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-300 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.email} 
                                  onChange={(e) => updateLeadField(lead.id, 'email', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-400 font-mono text-[11px]"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.company_name} 
                                  onChange={(e) => updateLeadField(lead.id, 'company_name', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full font-semibold text-zinc-200 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.role} 
                                  onChange={(e) => updateLeadField(lead.id, 'role', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-400 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.phone} 
                                  onChange={(e) => updateLeadField(lead.id, 'phone', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-400 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.location} 
                                  onChange={(e) => updateLeadField(lead.id, 'location', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-400 text-xs"
                                />
                              </td>
                              <td className="p-1">
                                <input 
                                  value={lead.category} 
                                  onChange={(e) => updateLeadField(lead.id, 'category', e.target.value)}
                                  className="bg-transparent border-0 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-500 rounded px-2 py-1.5 w-full text-zinc-400 text-xs"
                                />
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => deleteLead(lead.id)}
                                  className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 rounded transition-all cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {leads.length === 0 && (
                            <tr>
                              <td colSpan={9} className="text-center py-10 text-zinc-500 font-mono text-xs">
                                No leads loaded. Use the form below to add a lead, or switch to Raw CSV mode to paste text.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ADD NEW LEAD FORM */}
                    <form onSubmit={handleAddLead} className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5 space-y-4">
                      <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider font-mono">
                        <Plus className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Insert New Recipient</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <input 
                          type="text"
                          placeholder="first_name *"
                          value={newLead.first_name}
                          onChange={(e) => setNewLead(prev => ({ ...prev, first_name: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="last_name"
                          value={newLead.last_name}
                          onChange={(e) => setNewLead(prev => ({ ...prev, last_name: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="email"
                          placeholder="email *"
                          value={newLead.email}
                          onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="company_name *"
                          value={newLead.company_name}
                          onChange={(e) => setNewLead(prev => ({ ...prev, company_name: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="role"
                          value={newLead.role}
                          onChange={(e) => setNewLead(prev => ({ ...prev, role: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="phone"
                          value={newLead.phone}
                          onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="location"
                          value={newLead.location}
                          onChange={(e) => setNewLead(prev => ({ ...prev, location: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                        <input 
                          type="text"
                          placeholder="category"
                          value={newLead.category}
                          onChange={(e) => setNewLead(prev => ({ ...prev, category: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[11px] text-zinc-500 font-mono">* Required fields</span>
                        <button 
                          type="submit"
                          className="bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-4.5 py-2 rounded text-xs flex items-center gap-1.5 uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>Insert Lead Row</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* RAW CSV EDITOR VIEW */}
                {leadsTab === 'raw' && (
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col relative min-h-[300px]">
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <button 
                          onClick={() => copyToClipboard(rawCSVContent, 'leads.csv')}
                          className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all shadow-sm cursor-pointer"
                        >
                          {copiedFile === 'leads.csv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 text-[11px] font-mono text-zinc-500">
                        Raw CSV Content (Editable, maps to Spreadsheet Grid)
                      </div>
                      <textarea
                        value={rawCSVContent}
                        onChange={handleCSVChange}
                        className="p-5 bg-zinc-950 font-mono text-[11px] text-zinc-300 flex-1 leading-relaxed outline-none resize-none focus:ring-0 select-all"
                        placeholder="first_name,last_name,email,company_name,role,phone,location,category"
                      />
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg flex items-start gap-3 text-xs text-zinc-400 leading-normal">
                      <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <div>
                        Editing this plaintext area directly recompiles the Spreadsheet. Keep columns separated by commas and make sure column headers on line 1 map exactly.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: template_1.txt */}
            {activeFile === 'template_1.txt' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-zinc-100 flex items-center gap-2 uppercase font-mono">
                      <FileText className="w-4.5 h-4.5 text-zinc-400" />
                      templates / template_1.txt
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mt-1.5">
                      This template is read by Python's core script and replaces text matching bracketed tags with real columns.
                    </p>
                  </div>

                  {/* TAB TABS */}
                  <div className="flex bg-zinc-950 p-1 rounded border border-zinc-800 shrink-0 self-start md:self-center">
                    <button 
                      onClick={() => setTemplateTab('edit')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        templateTab === 'edit' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-slate-200'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Template Editor
                    </button>
                    <button 
                      onClick={() => setTemplateTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        templateTab === 'preview' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Merge Preview
                    </button>
                  </div>
                </div>

                {/* WORKSPACE FOR TEMPLATE */}
                {templateTab === 'edit' && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
                    
                    {/* PLACEHOLDERS HELPER SECTION */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5 space-y-4 h-fit">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-zinc-400" />
                        <h4 className="text-xs font-bold tracking-widest text-zinc-200 uppercase font-mono">Placeholder Guide</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Click on any variable key below to copy or insert its bracketed placeholder at your current text-cursor coordinate.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'first_name', 'last_name', 'email', 'company_name', 
                          'role', 'phone', 'location', 'category'
                        ].map(key => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => insertPlaceholder(key)}
                            className="text-left px-3 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded text-[11px] font-mono text-zinc-300 transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span>[{key.toUpperCase()}]</span>
                            <Plus className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                          </button>
                        ))}
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-[11px] text-zinc-400 leading-relaxed space-y-2.5">
                        <strong className="block text-zinc-200 font-bold uppercase tracking-wider text-[10px] font-mono">💡 Subject Rule Built-In</strong>
                        Our Python code is programmed to parse the first line of the template starting with <code className="font-mono bg-zinc-950 text-zinc-300 px-1 py-0.5 rounded text-[10px] border border-zinc-800">Subject:</code> as the email's Subject, and uses the remaining lines as the actual email text body!
                      </div>
                    </div>

                    {/* CENTRAL TEMPLATE EDITOR */}
                    <div className="xl:col-span-2 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 flex flex-col min-h-[350px]">
                      <div className="bg-zinc-900/50 px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center text-[11px] font-mono text-zinc-500">
                        <span>templates / template_1.txt (plain text editor)</span>
                        <button 
                          onClick={() => copyToClipboard(templateText, 'template')}
                          className="hover:text-zinc-300 cursor-pointer"
                        >
                          Copy template content
                        </button>
                      </div>
                      <textarea
                        id="template-textarea"
                        value={templateText}
                        onChange={(e) => setTemplateText(e.target.value)}
                        className="p-5 bg-zinc-950 font-mono text-xs md:text-sm text-zinc-200 flex-1 leading-relaxed outline-none resize-none focus:ring-0"
                        placeholder="Subject: Insert Email Subject Here..."
                      />
                    </div>
                  </div>
                )}

                {/* LIVE MERGE PREVIEW PANEL */}
                {templateTab === 'preview' && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
                    
                    {/* LEAD SWITCHER SIDEBAR */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5 space-y-4 h-fit">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-400" />
                        <h4 className="text-xs font-bold tracking-widest text-zinc-200 uppercase font-mono">Select Client Lead</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Choose a recipient row from your CSV table below to see how our Python script will merge and personalize their email in real-time.
                      </p>
                      
                      <div className="space-y-2">
                        {leads.map(lead => (
                          <button
                            key={lead.id}
                            onClick={() => setPreviewLeadId(lead.id)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                              previewLeadId === lead.id
                                ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                                : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                            }`}
                          >
                            <div>
                              <div className="font-semibold">{lead.first_name} {lead.last_name}</div>
                              <div className="text-[10px] font-mono opacity-80 mt-0.5">{lead.company_name} • {lead.role}</div>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              previewLeadId === lead.id ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-900 text-zinc-400 border border-zinc-850'
                            }`}>
                              {lead.location}
                            </span>
                          </button>
                        ))}
                        {leads.length === 0 && (
                          <p className="text-xs text-zinc-500 italic text-center py-4">No active leads found in leads.csv.</p>
                        )}
                      </div>
                    </div>

                    {/* ACTIVE EMAIL MERGED OUTPUT PREVIEW */}
                    <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col min-h-[350px]">
                      
                      {/* SIMULATED EMAIL WRAPPER */}
                      <div className="bg-zinc-900/50 px-4 py-2.5 border-b border-zinc-850 flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">Merged Email Client Viewer</span>
                      </div>

                      {/* CLIENT METADATA FIELD */}
                      <div className="p-4 bg-zinc-950 border-b border-zinc-900 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <span className="w-16 font-mono font-bold uppercase text-[10px] tracking-wider">From:</span>
                          <span className="text-zinc-300 font-mono bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <span className="w-16 font-mono font-bold uppercase text-[10px] tracking-wider">To:</span>
                          <span className="text-zinc-300 font-mono bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                            {leads.find(l => l.id === previewLeadId)?.email || 'No email specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <span className="w-16 font-mono font-bold uppercase text-[10px] tracking-wider">Subject:</span>
                          <span className="text-zinc-200 font-semibold">
                            {mergedPreview.toLowerCase().startsWith('subject:') 
                              ? mergedPreview.split('\n', 1)[0].replace(/^subject:/i, '').strip || mergedPreview.split('\n', 1)[0].replace(/^subject:/i, '').trim()
                              : 'Design Inquiry'}
                          </span>
                        </div>
                      </div>

                      {/* EMAIL BODY CONTENT PREVIEW */}
                      <div className="p-6 bg-zinc-950/20 text-zinc-300 text-sm leading-relaxed overflow-y-auto font-sans flex-1">
                        <pre className="whitespace-pre-wrap font-sans text-zinc-300">
                          {/* Strip subject line from the render output */}
                          {mergedPreview.toLowerCase().startsWith('subject:')
                            ? mergedPreview.split('\n').slice(1).join('\n').trim()
                            : mergedPreview}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: guide */}
            {activeFile === 'guide' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/80 flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-zinc-100 uppercase font-mono">Windows Getting Started Manual</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Follow these step-by-step instructions to set up Python and run your cold email campaign successfully on Windows.
                    </p>
                  </div>
                </div>

                {/* STEPPER STEP TOGGLE TABS */}
                <div className="flex bg-zinc-950 p-1 rounded border border-zinc-800 overflow-x-auto gap-1">
                  {[
                    { nr: 1, label: '1. Install Python' },
                    { nr: 2, label: '2. Save Folder' },
                    { nr: 3, label: '3. Setup config.txt' },
                    { nr: 4, label: '4. Execute Script' },
                    { nr: 5, label: '5. Logs & Results' }
                  ].map(step => (
                    <button
                      key={step.nr}
                      onClick={() => setGuideStep(step.nr)}
                      className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        guideStep === step.nr
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        guideStep === step.nr ? 'bg-zinc-950 text-zinc-100 font-bold' : 'bg-zinc-900 text-zinc-500'
                      }`}>
                        {step.nr}
                      </span>
                      <span>{step.label}</span>
                    </button>
                  ))}
                </div>

                {/* ACTIVE STEP WORKSPACE */}
                <div className="bg-zinc-900/10 border border-zinc-800 rounded-lg p-6 space-y-4">
                  {guideStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Step 1 of 5</span>
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">Install Python on your Windows Machine</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        If you do not have Python installed yet, follow these instructions to install it from scratch:
                      </p>
                      
                      <ol className="list-decimal pl-5 space-y-3.5 text-xs text-zinc-400 leading-relaxed">
                        <li>
                          Open your web browser and navigate to the official Python download page: <a href="https://www.python.org/downloads/windows/" target="_blank" rel="noreferrer" className="text-zinc-300 hover:underline inline-flex items-center gap-1 font-semibold">python.org/downloads <ExternalLink className="w-3 h-3 inline" /></a>
                        </li>
                        <li>
                          Click the yellow button to download the latest installer for Windows (e.g., <strong>Python 3.12.x</strong>).
                        </li>
                        <li>
                          Double-click the downloaded file (usually named something like <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">python-3.12.x-amd64.exe</code>) to start the installation setup.
                        </li>
                        <li className="text-zinc-300 bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg leading-normal">
                          <strong className="text-amber-400 block font-bold uppercase tracking-wider text-[10px] font-mono mb-1">⚠️ CRUCIAL REQUIREMENT:</strong> At the very bottom of the initial setup window, check the box that says <strong>"Add python.exe to PATH"</strong> before clicking "Install Now". If you miss this checkbox, Windows will not recognize python commands in your command prompt!
                        </li>
                        <li>
                          Click <strong>"Install Now"</strong>, wait for the setup to complete, and then click "Close".
                        </li>
                      </ol>

                      {/* VERIFICATION HELPER COMMAND */}
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-zinc-500">Verify Installation</span>
                          <button 
                            onClick={() => copyToClipboard('python --version', 'verification command')}
                            className="text-[10px] text-zinc-400 hover:text-white transition-all bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded cursor-pointer"
                          >
                            Copy command
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 leading-normal">
                          Open your Windows Command Prompt (press <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[11px] font-mono">Win + R</kbd>, type <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[11px] font-mono">cmd</kbd>, and press Enter) and type:
                        </p>
                        <div className="font-mono text-xs text-zinc-300 bg-zinc-900 p-3 rounded border border-zinc-800">
                          python --version
                        </div>
                        <p className="text-xs text-zinc-500">
                          If it returns something like <code className="text-zinc-300 font-mono">Python 3.12.2</code>, you are ready to continue to Step 2!
                        </p>
                      </div>
                    </div>
                  )}

                  {guideStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Step 2 of 5</span>
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">Extract and Arrange the Campaign Directory</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        To run the script, all files must reside in a single folder located in a clean directory (like your Desktop).
                      </p>
                      
                      <ol className="list-decimal pl-5 space-y-3 text-xs text-zinc-400 leading-relaxed">
                        <li>
                          Click the prominent <strong>"Download Script Bundle"</strong> button at the top-right of this page.
                        </li>
                        <li>
                          Locate the downloaded file <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">intent-studios-cold-email-suite.zip</code> in your Downloads folder.
                        </li>
                        <li>
                          Right-click the ZIP folder and select <strong>"Extract All..."</strong>. Set the destination path to your Windows Desktop and click "Extract".
                        </li>
                        <li>
                          Open the extracted folder. You should see the exact directory structure:
                        </li>
                      </ol>

                      {/* TREE RE-DEMO */}
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                        <div className="text-zinc-100">📁 cold-email-tool/</div>
                        <div className="pl-4 text-zinc-400">├── 📄 config.txt</div>
                        <div className="pl-4 text-zinc-400">├── 📄 leads.csv</div>
                        <div className="pl-4 text-zinc-400">├── 📄 send_emails.py</div>
                        <div className="pl-4 text-zinc-400">├── 📁 templates/</div>
                        <div className="pl-8 text-zinc-500">└── 📄 template_1.txt</div>
                        <div className="pl-4 text-zinc-500">└── 📁 results/</div>
                      </div>
                    </div>
                  )}

                  {guideStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Step 3 of 5</span>
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">Double-Check config.txt Credentials</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Open the file <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">config.txt</code> with Windows Notepad or any text editor. It must contain exactly two lines:
                      </p>
                      
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
                        <div>line 1: hello@intentstudios.com</div>
                        <div>line 2: your_titan_email_password_here</div>
                      </div>

                      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-zinc-400 space-y-1.5 leading-normal">
                        <strong className="block text-zinc-300 font-bold uppercase tracking-wider text-[10px] font-mono">⚠️ Important Formatting Rules:</strong>
                        <div>- Do not add text labels (like "Email: " or "Password: "). Just paste the raw credentials.</div>
                        <div>- Do not add empty lines before or after the content.</div>
                        <div>- Make sure no extra spaces are pasted at the end of either line.</div>
                      </div>
                    </div>
                  )}

                  {guideStep === 4 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Step 4 of 5</span>
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">Execute the Python Script</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Now, open Command Prompt directly inside your campaign folder to launch the automation:
                      </p>
                      
                      <ol className="list-decimal pl-5 space-y-3 text-xs text-zinc-400 leading-relaxed">
                        <li>
                          Open your extracted <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">cold-email-tool</code> folder in Windows File Explorer.
                        </li>
                        <li>
                          Click inside the empty space of the Explorer address bar at the top, type <kbd className="bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-100 font-mono text-[11px]">cmd</kbd>, and press Enter. This will open Command Prompt pre-navigated to your active folder!
                        </li>
                        <li>
                          Copy and paste the command below, then press Enter:
                        </li>
                      </ol>

                      {/* COPY SCRIPT COMMAND */}
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-zinc-500">Execution Command</span>
                          <button 
                            onClick={() => copyToClipboard('python send_emails.py', 'run script command')}
                            className="text-[10px] text-zinc-400 hover:text-white transition-all bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded cursor-pointer"
                          >
                            Copy command
                          </button>
                        </div>
                        <div className="font-mono text-xs text-zinc-300 bg-zinc-900 p-3 rounded border border-zinc-800">
                          python send_emails.py
                        </div>
                      </div>
                    </div>
                  )}

                  {guideStep === 5 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Step 5 of 5</span>
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">Monitor Logs and Results Log</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Once completed, a folder named <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">results/</code> will be created in your workspace.
                      </p>
                      
                      <ul className="list-disc pl-5 space-y-3.5 text-xs text-zinc-400 leading-relaxed">
                        <li>
                          Inside, you will find <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">results.csv</code> containing all columns from your original CSV, plus a new <code className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800 text-[11px]">status</code> column at the very end.
                        </li>
                        <li>
                          The status cell will show either <strong className="text-emerald-400 font-bold uppercase">SENT</strong> for successful SMTP deliveries, or <strong className="text-rose-400 font-bold uppercase">FAILED</strong> for bounces or connection errors.
                        </li>
                        <li>
                          Review any failure stack-traces in your command prompt terminal to address wrong addresses or password errors.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* BACK & FORWARD MANUAL NAVIGATION */}
                <div className="flex justify-between items-center">
                  <button
                    disabled={guideStep === 1}
                    onClick={() => setGuideStep(prev => prev - 1)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-200 transition-all disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                  <button
                    disabled={guideStep === 5}
                    onClick={() => setGuideStep(prev => prev + 1)}
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-bold uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: terminal (simulation logs) */}
            {activeFile === 'terminal' && (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="bg-zinc-900/40 p-5 rounded-lg border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-zinc-100 uppercase font-mono">
                      Campaign Live Simulator
                    </h3>
                    <p className="text-xs text-zinc-400 leading-normal mt-1.5 max-w-2xl">
                      Visualize the terminal logs generated during the loop on Windows with your customized leads.
                    </p>
                  </div>
                  <button
                    onClick={runTerminalSimulation}
                    disabled={isSimulating}
                    className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSimulating ? 'Sending...' : 'Restart Sim'}</span>
                  </button>
                </div>

                {/* LOGS INNER TERMINAL CONTAINER */}
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col min-h-[300px] shadow-sm">
                  <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 inline-block" />
                      cmd.exe - python send_emails.py
                    </span>
                    <span>1200 bps</span>
                  </div>
                  
                  <div className="p-5 overflow-auto font-mono text-[11px] text-zinc-300 flex-1 space-y-1 select-all leading-normal">
                    {simulatedLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={
                          log.includes('[SUCCESS]') 
                            ? 'text-emerald-400' 
                            : log.includes('[FAILED]') || log.includes('[ERROR]') 
                            ? 'text-rose-400 font-bold' 
                            : log.includes('[*]') 
                            ? 'text-zinc-500' 
                            : 'text-zinc-300'
                        }
                      >
                        {log}
                      </div>
                    ))}
                    {isSimulating && (
                      <span className="inline-block w-2 h-4.5 bg-zinc-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PERSISTENT FOOTER UTILITY BAR */}
          <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/40 p-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              <span>Configure your credentials, template, and client leads to download a ready-to-run ZIP bundle.</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono text-zinc-600">
              <span>Port: 3000 (Proxy)</span>
              <span>•</span>
              <span>Titan Mail SSL (465)</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
