$response = Invoke-WebRequest -Uri "https://rachitaggarwal.vercel.app/admin/login" -UseBasicParsing
$html = $response.Content

# Find all script src URLs
$scriptMatches = [regex]::Matches($html, '_next/static/chunks/[^"]+\.js')
$scriptUrls = $scriptMatches | ForEach-Object { "https://rachitaggarwal.vercel.app/" + $_.Value } | Select-Object -Unique

Write-Host "Found scripts:"
$scriptUrls | ForEach-Object { Write-Host $_ }

# Search each script for API URL
foreach ($url in $scriptUrls) {
    try {
        $js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
        if ($js -match 'onrender') {
            $m = [regex]::Match($js, 'https://[a-z0-9\-]+\.onrender\.com[^"]*')
            Write-Host "FOUND API URL: $($m.Value)"
            break
        }
        if ($js -match 'NEXT_PUBLIC_API_URL') {
            Write-Host "Found NEXT_PUBLIC_API_URL in $url"
        }
    } catch {}
}
