$path = 'src/app/cashiers/page.tsx'
$bytes = [System.IO.File]::ReadAllBytes($path)
Write-Host "length=$($bytes.Length)"
Write-Host "prefix bytes=$($bytes[0..15] -join ',')"
$utf8 = [System.Text.Encoding]::UTF8
$cp1256 = [System.Text.Encoding]::GetEncoding(1256)
try {
  $textUtf8 = $utf8.GetString($bytes)
  Write-Host "utf8 decoded OK"
  Write-Host ($textUtf8.Substring(0,[Math]::Min(200,$textUtf8.Length)))
} catch {
  Write-Host "utf8 decode error: $($_.Exception.Message)"
}
try {
  $text1256 = $cp1256.GetString($bytes)
  Write-Host "cp1256 decoded OK"
  Write-Host ($text1256.Substring(0,[Math]::Min(200,$text1256.Length)))
} catch {
  Write-Host "cp1256 decode error: $($_.Exception.Message)"
}
