# Source all company-specific shell files, one directory layer deep.
# Each company lives in its own subdirectory; only *.sh files are sourced
# so Ruby/other supporting files can sit alongside without being executed.
for _company_dir in "${0:A:h}"/*/; do
  for _company_file in "$_company_dir"*.sh; do
    [ -f "$_company_file" ] && source "$_company_file"
  done
done
unset _company_file _company_dir
