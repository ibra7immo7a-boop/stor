$p = 'package.json'
$t = Get-Content -Raw $p
$t = $t -replace '"serverless-http":\s*"\^3.0.0",\s*', '"serverless-http": "^3.0.0",\n    "zustand": "^4.4.0",\n    '
Set-Content -Path $p -Value $t -Encoding UTF8
Write-Host 'updated'