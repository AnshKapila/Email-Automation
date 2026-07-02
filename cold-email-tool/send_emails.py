# -*- coding: utf-8 -*-
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
            f"The configuration file '{CONFIG_FILE}' is missing!\n"
            f"Please create a file named '{CONFIG_FILE}' in the same folder as this script.\n"
            f"Line 1 should be your email address, and Line 2 should be your password."
        )
    
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        # Read lines and strip any leading/trailing spaces or newlines
        lines = [line.strip() for line in f.readlines()]
    
    # Check if we have at least 2 lines (email and password)
    if len(lines) < 2 or not lines[0] or not lines[1]:
        raise ValueError(
            f"The '{CONFIG_FILE}' file must contain exactly two lines:\n"
            f"Line 1: Your full email address (e.g., hello@intentstudios.com)\n"
            f"Line 2: Your password or app password"
        )
    
    return lines[0], lines[1]


def load_template():
    """
    Reads the raw plain text of the email template from templates/template_1.txt.
    """
    if not os.path.exists(TEMPLATE_FILE):
        raise FileNotFoundError(
            f"The template file is missing at: {TEMPLATE_FILE}\n"
            f"Please create the 'templates' folder and place 'template_1.txt' inside it."
        )
    
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return f.read()


def personalize_message(template_text, lead_data):
    """
    Scans the email template text for placeholders inside square brackets
    and replaces them with the actual values from the lead's row in the CSV.
    
    For example:
    [FIRST_NAME] will be replaced by the value in the 'first_name' column.
    [COMPANY_NAME] will be replaced by the value in the 'company_name' column.
    """
    personalized_text = template_text
    
    # Loop through each column (key) and value in the lead's row
    for column_name, value in lead_data.items():
        # Placeholders are uppercase inside square brackets: [COLUMN_NAME]
        placeholder = f"[{column_name.upper()}]"
        
        # Replace all occurrences of this placeholder with the actual value (converted to text)
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
        print(f"[ERROR] Failed to load credentials from '{CONFIG_FILE}':\n  {e}")
        print("\nStopping script. Please fix the error above and try again.")
        return

    # --- Step 2: Load Email Template ---
    try:
        template_text = load_template()
        print("[*] Successfully loaded 'templates/template_1.txt'")
    except Exception as e:
        print(f"[ERROR] Failed to load the template file:\n  {e}")
        print("\nStopping script. Please fix the error above and try again.")
        return

    # --- Step 3: Load Lead CSV File ---
    if not os.path.exists(LEADS_FILE):
        print(f"[ERROR] Leads file '{LEADS_FILE}' not found!")
        print("Please ensure you have placed your 'leads.csv' in the same folder as this script.")
        return

    leads = []
    fieldnames = []
    
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        # Use Python's built-in CSV reader which converts each row into a dictionary
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
        print(f"[CRITICAL ERROR] Failed to connect/login to SMTP server:\n  {e}")
        print("\nSuggestions:")
        print("1. Double-check your email address and password in 'config.txt'")
        print("2. Ensure your computer is connected to the internet")
        print("3. Check if your mail provider requires an 'App Password' instead of your main password")
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
            # If the template's first line is "Subject: Custom Subject Line", we extract it
            subject = f"Design Inquiry for {company_name}"  # Default subject if not found
            body_content = full_personalized_email
            
            if full_personalized_email.strip().lower().startswith("subject:"):
                # Split at the first newline character
                parts = full_personalized_email.split("\n", 1)
                subject_line = parts[0]
                # Strip the "Subject:" tag to get just the text
                subject = subject_line[8:].strip()
                # The rest of the text is our body content
                body_content = parts[1].strip() if len(parts) > 1 else ""

            # Prepare the MIME email structure
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = email_to
            msg['Subject'] = subject
            msg.attach(MIMEText(body_content, 'plain', 'utf-8'))

            # Send the email and handle failures safely
            try:
                # server.sendmail actually pushes the email to the recipient's SMTP gateway
                server.sendmail(sender_email, email_to, msg.as_string())
                print(f"  -> [SUCCESS] Email sent to <{email_to}>")
                lead["status"] = "SENT"
                total_sent += 1
            except Exception as email_err:
                print(f"  -> [FAILED] Could not send to <{email_to}>. Error details:")
                print(f"     {email_err}")
                lead["status"] = "FAILED"
                total_failed += 1
            
            # Save our updated lead dict (now with status) to our list
            results_list.append(lead)

            # Delay to avoid getting blacklisted as spam, unless this is the last email
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
    # The new CSV needs all the original headers plus a 'status' column at the end
    new_headers = list(fieldnames) + ["status"]
    
    try:
        with open(RESULTS_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=new_headers)
            writer.writeheader()
            writer.writerows(results_list)
        print("-" * 60)
        print(f"[*] Results successfully saved to: {RESULTS_FILE}")
    except Exception as csv_err:
        print(f"[ERROR] Could not save results to '{RESULTS_FILE}':\n  {csv_err}")

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
    main()
