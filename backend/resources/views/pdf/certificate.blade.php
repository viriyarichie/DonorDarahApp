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
            background: #fff;
            position: relative;
        }
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
            top: 12mm;
            left: 12mm;
            right: 12mm;
            bottom: 12mm;
            border: 1px solid #cc0000;
        }
        .content {
            position: absolute;
            top: 15mm;
            left: 15mm;
            right: 15mm;
            bottom: 15mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .pmi-logo {
            width: 60px;
            margin-bottom: 8px;
        }
        .org-name {
            font-size: 11pt;
            color: #cc0000;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 4px;
        }
        .org-subtitle {
            font-size: 8pt;
            color: #666;
            margin-bottom: 16px;
        }
        .divider {
            width: 200px;
            height: 2px;
            background: linear-gradient(to right, transparent, #cc0000, transparent);
            margin-bottom: 16px;
        }
        .cert-title {
            font-size: 22pt;
            font-weight: bold;
            color: #cc0000;
            text-transform: uppercase;
            letter-spacing: 5px;
            margin-bottom: 4px;
        }
        .cert-subtitle {
            font-size: 9pt;
            color: #666;
            margin-bottom: 20px;
        }
        .awarded-to {
            font-size: 10pt;
            color: #333;
            margin-bottom: 8px;
        }
        .recipient-name {
            font-size: 26pt;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
            font-style: italic;
        }
        .milestone-text {
            font-size: 11pt;
            color: #333;
            max-width: 500px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .milestone-text strong {
            color: #cc0000;
            font-size: 14pt;
        }
        .signatures {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-top: 20px;
        }
        .signature-block {
            text-align: center;
            width: 150px;
        }
        .signature-line {
            border-bottom: 1px solid #333;
            width: 120px;
            margin: 30px auto 4px;
        }
        .signature-name {
            font-size: 9pt;
            font-weight: bold;
        }
        .signature-title {
            font-size: 8pt;
            color: #666;
        }
        .cert-number {
            position: absolute;
            bottom: 18mm;
            right: 18mm;
            font-size: 7pt;
            color: #999;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80pt;
            color: rgba(204, 0, 0, 0.04);
            font-weight: bold;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="watermark">PMI</div>
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="content">
        <div class="org-name">Palang Merah Indonesia</div>
        <div class="org-subtitle">Markas Besar &bull; Jakarta, Indonesia</div>
        <div class="divider"></div>
        <div class="cert-title">Sertifikat Penghargaan</div>
        <div class="cert-subtitle">CERTIFICATE OF APPRECIATION</div>
        <div class="awarded-to">Dengan bangga diberikan kepada</div>
        <div class="recipient-name">{{ $user->name }}</div>
        <div class="milestone-text">
            Atas dedikasi dan keikhlasan dalam mendonorkan darah sebanyak
            <strong>{{ $certificate->milestone }} Kali</strong>
            sebagai wujud kepedulian terhadap sesama manusia.
        </div>
        <div style="font-size: 9pt; color: #333; margin-bottom: 16px;">
            Dikeluarkan pada: {{ $certificate->issue_date ? $certificate->issue_date->format('d F Y') : date('d F Y') }}
        </div>
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-name">Pengurus PMI</div>
                <div class="signature-title">Ketua Unit Transfusi Darah</div>
            </div>
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-name">Pengurus PMI</div>
                <div class="signature-title">Ketua Umum PMI</div>
            </div>
        </div>
    </div>
    <div class="cert-number">No. Sertifikat: PMI/{{ str_pad($certificate->id, 6, '0', STR_PAD_LEFT) }}/{{ date('Y') }}</div>
</body>
</html>
