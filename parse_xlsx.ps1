[xml]$ss = Get-Content 'C:\Users\obief\Downloads\Archive(1)\xlsx_extract2\emb_xlsx\xl-sharedStrings.xml' -Raw -Encoding UTF8
$strings = @()
foreach ($si in $ss.sst.si) {
    if ($si.t -is [System.Xml.XmlElement]) { $val = $si.t.InnerText }
    elseif ($si.t -ne $null) { $val = $si.t }
    else { $val = '' }
    $strings += $val
}

[xml]$sheet = Get-Content 'C:\Users\obief\Downloads\Archive(1)\xlsx_extract2\emb_xlsx\xl-worksheets-sheet1.xml' -Raw -Encoding UTF8
$ns = New-Object System.Xml.XmlNamespaceManager($sheet.NameTable)
$ns.AddNamespace('x', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')
$rows = $sheet.SelectNodes('//x:row', $ns)
Write-Host ('Total rows found: ' + $rows.Count)

foreach ($row in $rows) {
    $rowNum = $row.r
    $cells = $row.SelectNodes('x:c', $ns)
    $parts = @()
    foreach ($cell in $cells) {
        $ref = $cell.r
        $t = $cell.t
        $vNode = $cell.SelectSingleNode('x:v', $ns)
        if ($vNode -ne $null) {
            if ($t -eq 's') {
                $idx = [int]$vNode.InnerText
                $val = ($strings[$idx] -replace "`n", ' ' -replace "`r", '').Trim()
            } else {
                $val = $vNode.InnerText
            }
            $parts += ($ref + '=' + $val)
        }
    }
    if ($parts.Count -gt 0) {
        Write-Host ('Row ' + $rowNum + ': ' + ($parts -join ' | '))
    }
}
