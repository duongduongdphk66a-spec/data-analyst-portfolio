# Sync 11 Core Screens (Desktop & Mobile Screenshots + Wireframes) from C:\Users\ADMIN\Documents\prj\docs
$ErrorActionPreference = "Stop"

$SourceScreenshots = "C:\Users\ADMIN\Documents\prj\docs\screenshots"
$SourceWireframes  = "C:\Users\ADMIN\Documents\prj\docs\wireframes"
$TargetDir         = Join-Path $PSScriptRoot "..\public\library-bus\screens"

if (-not (Test-Path $SourceScreenshots)) {
    Write-Error "Khong tim thay thu muc: $SourceScreenshots"
}
if (-not (Test-Path $SourceWireframes)) {
    Write-Error "Khong tim thay thu muc: $SourceWireframes"
}
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$Slugs = @(
    "01_trang_chu",
    "02_gioi_thieu",
    "03_kho_sach",
    "04_chi_tiet_sach",
    "05_quyen_gop_sach",
    "06_danh_sach_chuyen_xe",
    "07_chi_tiet_lo_trinh",
    "08_ho_so_ban_doc",
    "09_quan_ly_muon_tra",
    "10_analytics_dashboard",
    "11_django_admin"
)

function Find-FirstExisting {
    param([string[]]$Candidates)
    foreach ($c in $Candidates) {
        if (Test-Path $c) { return $c }
    }
    return $null
}

$CopiedCount = 0

foreach ($slug in $Slugs) {
    $num = $slug.Substring(0, 2)

    # 1. Desktop Screenshot
    $deskScreenSrc = Find-FirstExisting @(
        (Join-Path $SourceScreenshots "desktop\${slug}_desktop.webp"),
        (Join-Path $SourceScreenshots "desktop\${slug}.webp"),
        (Join-Path $SourceScreenshots "${slug}_desktop.webp")
    )
    if ($deskScreenSrc) {
        Copy-Item $deskScreenSrc (Join-Path $TargetDir "screen_${slug}.webp") -Force
        Copy-Item $deskScreenSrc (Join-Path $TargetDir "sc_${slug}.webp") -Force
        $CopiedCount++
    } else {
        Write-Warning "Thieu Desktop Screenshot cho $slug"
    }

    # 2. Mobile Screenshot
    $mobScreenSrc = Find-FirstExisting @(
        (Join-Path $SourceScreenshots "mobile\${slug}_mobile.webp"),
        (Join-Path $SourceScreenshots "mobile\${slug}.webp"),
        (Join-Path $SourceScreenshots "${slug}_mobile.webp")
    )
    if ($mobScreenSrc) {
        Copy-Item $mobScreenSrc (Join-Path $TargetDir "screen_mobile_${slug}.webp") -Force
        Copy-Item $mobScreenSrc (Join-Path $TargetDir "sc_mobile_${slug}.webp") -Force
        $CopiedCount++
    } else {
        Write-Warning "Thieu Mobile Screenshot cho $slug"
    }

    # 3. Desktop Wireframe
    $deskWfSrc = Find-FirstExisting @(
        (Join-Path $SourceWireframes "desktop\wf_${slug}.webp"),
        (Join-Path $SourceWireframes "desktop\wf_${slug}_desktop.webp"),
        (Join-Path $SourceWireframes "wf_${slug}.webp")
    )
    if ($deskWfSrc) {
        Copy-Item $deskWfSrc (Join-Path $TargetDir "wf_${slug}.webp") -Force
        $CopiedCount++
    } else {
        Write-Warning "Thieu Desktop Wireframe cho $slug"
    }

    # 4. Mobile Wireframe
    $mobWfSrc = Find-FirstExisting @(
        (Join-Path $SourceWireframes "mobile\wf_mobile_${slug}.webp"),
        (Join-Path $SourceWireframes "mobile\wf_${slug}_mobile.webp"),
        (Join-Path $SourceWireframes "mobile\wf_${slug}.webp"),
        (Join-Path $SourceWireframes "wf_mobile_${slug}.webp"),
        (Join-Path $SourceWireframes "wf_${slug}_mobile.webp")
    )
    if (-not $mobWfSrc) {
        $foundMob = Get-ChildItem -Path $SourceWireframes -Recurse -Filter "*.webp" | Where-Object {
            $_.FullName -match "mobile" -and $_.Name -match "^wf_.*${num}_"
        } | Select-Object -First 1
        if ($foundMob) { $mobWfSrc = $foundMob.FullName }
    }
    if ($mobWfSrc) {
        Copy-Item $mobWfSrc (Join-Path $TargetDir "wf_mobile_${slug}.webp") -Force
        $CopiedCount++
    } else {
        Write-Warning "Thieu Mobile Wireframe cho $slug"
    }
}

Write-Host "Da dong bo $CopiedCount tep (11 Desktop + 11 Mobile x 2 loai) vao $TargetDir" -ForegroundColor Green
