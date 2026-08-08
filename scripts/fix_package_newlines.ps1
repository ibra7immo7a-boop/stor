$p='package.json'
$t=Get-Content -Raw $p
# replace literal backslash-n sequences with real newlines
$t = $t -replace '\\n', "`n"
# also remove any stray leading backslashes before quotes
$t = $t -replace '\\"', '"'
Set-Content -Path $p -Value $t -Encoding UTF8
Write-Host 'fixed newlines'