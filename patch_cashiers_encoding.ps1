$path = 'src/app/cashiers/page.tsx'
$bytes = [System.IO.File]::ReadAllBytes($path)
$enc = [System.Text.Encoding]::GetEncoding(1256)
$text = $enc.GetString($bytes)
[System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
Write-Host 'encoding converted'