@echo off
:: ============================================================
:: PMI Donor Darah – Scheduler Runner
:: Letakkan file ini di folder DonorDarahApp\backend\
:: Daftarkan ke Windows Task Scheduler agar berjalan tiap menit
:: ============================================================

cd /d "%~dp0"
php artisan schedule:run >> storage\logs\scheduler.log 2>&1
