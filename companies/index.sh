# Source all company-specific shell files
for _company_file in "${0:A:h}"/*.sh; do
  [ -f "$_company_file" ] && [ "$(basename "$_company_file")" != "index.sh" ] && source "$_company_file"
done
unset _company_file
