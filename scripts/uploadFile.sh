#!/bin/bash

# Define the log file
logfile="upload_log.txt"

# Check if an argument is provided
if [ $# -eq 0 ]; then
    echo "Error: No filename provided."
    echo "Usage: $0 <filename>"
    exit 1
fi

filename=$1

# Check if the file exists
if [ ! -f "$filename" ]; then
    echo "Error: File '$filename' does not exist."
    exit 1
fi

echo "Uploading: $filename"
# Execute the curl command and log the output with a timestamp
{
    echo "--------------------------------------------------"
    echo "Log Entry: $(date)"
    echo "Uploading: $filename"
    curl https://api.mistral.ai/v1/files \
      -H "Authorization: Bearer $MISTRAL_API_KEY" \
      -F purpose="fine-tune" \
      -F file=@"$filename"
    echo -e "\n" # Adds an extra newline for better separation in the log
} >> "$logfile" 2>&1


