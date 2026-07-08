<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 297mm;
            height: 210mm;
            font-family: 'Times New Roman', Times, serif;
            background: #ffffff;
            color: #1a1a1a;
        }

        /* ── Borders ── */
        .border-outer {
            position: absolute;
            top: 8mm;
            left: 8mm;
            right: 8mm;
            bottom: 8mm;
            border: 4px solid #cc0000;
        }
        .border-inner {
            position: absolute;
            top: 13mm;
            left: 13mm;
            right: 13mm;
            bottom: 13mm;
            border: 1px solid #cc0000;
        }

        /* ── Watermark ── */
        .watermark {
            position: absolute;
            top: 80mm;
            left: 80mm;
            font-size: 90pt;
            color: #f7dddd;
            font-weight: bold;
            letter-spacing: 10px;
        }

        /* ── Content wrapper ── */
        .content {
            position: absolute;
            top: 18mm;
            left: 20mm;
            right: 20mm;
            bottom: 18mm;
            text-align: center;
        }

        /* ── Header ── */
        .org-name {
            font-size: 13pt;
            color: #cc0000;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 2mm;
        }
        .org-subtitle {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 5mm;
        }

        /* ── Divider ── */
        .divider {
            border: none;
            border-top: 2px solid #cc0000;
            width: 80mm;
            margin: 0 auto 5mm auto;
        }

        /* ── Main title ── */
        .cert-title {
            font-size: 24pt;
            font-weight: bold;
            color: #cc0000;
            text-transform: uppercase;
            letter-spacing: 5px;
            margin-bottom: 1mm;
        }
        .cert-subtitle {
            font-size: 9pt;
            color: #777777;
            margin-bottom: 6mm;
        }

        /* ── Recipient ── */
        .awarded-to {
            font-size: 10pt;
            color: #333333;
            margin-bottom: 3mm;
        }
        .recipient-name {
            font-size: 28pt;
            font-weight: bold;
            color: #1a1a1a;
            font-style: italic;
            margin-bottom: 4mm;
        }

        /* ── Body text ── */
        .milestone-text {
            font-size: 10pt;
            color: #333333;
            line-height: 1.7;
            margin-bottom: 4mm;
        }
        .milestone-highlight {
            color: #cc0000;
            font-size: 13pt;
            font-weight: bold;
        }
        .issue-date {
            font-size: 9pt;
            color: #444444;
            margin-bottom: 8mm;
        }

        /* ── Signatures ── */
        .signatures {
            width: 100%;
            margin-top: 4mm;
        }
        .sig-left {
            float: left;
            width: 100px;
            text-align: center;
            margin-left: 40mm;
        }
        .sig-right {
            float: right;
            width: 100px;
            text-align: center;
            margin-right: 40mm;
        }
        .sig-line {
            border-bottom: 1px solid #333;
            width: 90px;
            margin: 25px auto 4px auto;
        }
        .sig-name {
            font-size: 9pt;
            font-weight: bold;
            color: #1a1a1a;
        }
        .sig-title {
            font-size: 8pt;
            color: #666666;
        }
        .clearfix { clear: both; }

        /* ── Footer cert number ── */
        .cert-number {
            position: absolute;
            bottom: 16mm;
            right: 18mm;
            font-size: 7pt;
            color: #aaaaaa;
        }
    </style>
</head>
<body>

    <div class="watermark">PMI</div>
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <div class="content">
        <div class="org-name">Palang Merah Indonesia</div>
        <div class="org-subtitle">Unit Transfusi Darah &ndash; PMI Kota Surabaya</div>

        <hr class="divider">

        <div class="cert-title">Sertifikat Penghargaan</div>
        <div class="cert-subtitle">CERTIFICATE OF APPRECIATION</div>

        <div class="awarded-to">Dengan bangga diberikan kepada</div>
        <div class="recipient-name">{{ $user->name }}</div>

        <div class="milestone-text">
            Atas dedikasi dan keikhlasan dalam mendonorkan darah sebanyak
            <span class="milestone-highlight">{{ $certificate->milestone }} Kali</span>
            sebagai wujud kepedulian dan kemanusiaan kepada sesama.
        </div>

        <div class="issue-date">
            Dikeluarkan pada:
            {{ $certificate->issue_date ? $certificate->issue_date->format('d F Y') : \Carbon\Carbon::now()->translatedFormat('d F Y') }}
        </div>

        <div class="signatures">
            <div class="sig-left">
                <div class="sig-line"></div>
                <div class="sig-name">Pengurus PMI</div>
                <div class="sig-title">Kepala UTD PMI Surabaya</div>
            </div>
            <div class="sig-right">
                <div class="sig-line"></div>
                <div class="sig-name">Pengurus PMI</div>
                <div class="sig-title">Ketua PMI Kota Surabaya</div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>

    <div class="cert-number">No. Sertifikat: PMI-SBY/{{ str_pad($certificate->id, 6, '0', STR_PAD_LEFT) }}/{{ date('Y') }}</div>

</body>
</html>
