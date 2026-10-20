param(
  [string]$ArchivePath = (Join-Path $PSScriptRoot '..\work\harmony-balaton-villa-cpanel-20261008-v7-mobile-polish.zip')
)

$ErrorActionPreference = 'Stop'
$cpanelHost = 'fr-collins.guzelhosting.com'
$cpanelUser = 'harmonyb'
$remoteDirectory = '/home/harmonyb/relax-villa-app'
$archive = (Resolve-Path -LiteralPath $ArchivePath).Path
$archiveName = [System.IO.Path]::GetFileName($archive)
$securePassword = Read-Host -Prompt 'cPanel sifresi' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
  $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  $credential = '{0}:{1}' -f $cpanelUser, $plainPassword

  Write-Host '1/4 Paket cPanel dosya alanina yukleniyor...'
  $uploadArguments = @(
    '--silent', '--show-error', '--fail-with-body',
    '--user', $credential,
    '-F', "file-1=@$archive;filename=$archiveName",
    '-F', "dir=$remoteDirectory",
    "https://${cpanelHost}:2083/execute/Fileman/upload_files"
  )
  $uploadJson = & curl.exe @uploadArguments
  if ($LASTEXITCODE -ne 0) { throw 'cPanel paket yuklemesi basarisiz oldu.' }
  $upload = $uploadJson | ConvertFrom-Json
  if (-not $upload.result.status) {
    $message = ($upload.result.errors -join '; ')
    throw "cPanel yukleme hatasi: $message"
  }

  Write-Host '2/4 Paket uygulama klasorune cikartiliyor...'
  $extractArguments = @(
    '--silent', '--show-error', '--fail-with-body',
    '--user', $credential,
    '--get',
    '--data-urlencode', "cpanel_jsonapi_user=$cpanelUser",
    '--data-urlencode', 'cpanel_jsonapi_apiversion=2',
    '--data-urlencode', 'cpanel_jsonapi_module=Fileman',
    '--data-urlencode', 'cpanel_jsonapi_func=fileop',
    '--data-urlencode', 'op=extract',
    '--data-urlencode', "sourcefiles=relax-villa-app/$archiveName",
    '--data-urlencode', 'doubledecode=1',
    "https://${cpanelHost}:2083/json-api/cpanel"
  )
  $extractJson = & curl.exe @extractArguments
  if ($LASTEXITCODE -ne 0) { throw 'cPanel arsiv cikartma istegi basarisiz oldu.' }
  $extract = $extractJson | ConvertFrom-Json
  if (-not $extract.cpanelresult.event.result) {
    $message = $extract.cpanelresult.error
    throw "cPanel arsiv cikartma hatasi: $message"
  }
  $failedExtract = @($extract.cpanelresult.data | Where-Object { -not $_.result })
  if ($failedExtract.Count -gt 0) {
    throw ('Arsivde cikartilamayan dosya var: ' + (($failedExtract.err | Where-Object { $_ }) -join '; '))
  }

  Write-Host '3/4 Passenger yeniden baslatma isareti uygulandi.'
  Start-Sleep -Seconds 3

  Write-Host '4/4 Canli dosyalar kontrol ediliyor...'
  $cacheBuster = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $logoResponse = Invoke-WebRequest -Uri "https://harmonybalatonvilla.com/brand/logo-exact-primary.svg?v=$cacheBuster" -UseBasicParsing -TimeoutSec 45
  if ($logoResponse.StatusCode -ne 200 -or $logoResponse.Content -notmatch 'Harmony Balaton Villa yatay logosu') {
    throw 'Canli logo dosyasi beklenen icerikle donmedi.'
  }

  $homeResponse = Invoke-WebRequest -Uri "https://harmonybalatonvilla.com/?v=$cacheBuster" -UseBasicParsing -TimeoutSec 45
  if ($homeResponse.StatusCode -ne 200) {
    throw "Ana sayfa HTTP $($homeResponse.StatusCode) dondu."
  }

  Write-Host 'YAYIN BASARILI: Dogru Harmony Balaton Villa logosu canli sunucuda.'
}
finally {
  if ($null -ne $passwordPointer -and $passwordPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
  }
  $plainPassword = $null
  $credential = $null
}
