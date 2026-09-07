@echo off
REM ==========================================================================
REM  PORTFOLIO - encerra o servidor do site.
REM
REM  Mata SO o programa que esta ocupando a porta 4173, achando o numero do
REM  processo pelo netstat. Nao usa "taskkill /IM node.exe", que derrubaria
REM  qualquer outro projeto Node aberto no computador.
REM ==========================================================================

echo.
echo Procurando o servidor do site na porta 4173...

set "ALVO="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":4173" ^| findstr "LISTENING"') do set "ALVO=%%p"

if not defined ALVO (
    echo.
    echo Nenhum servidor rodando na porta 4173. Nada a fazer.
    echo.
    pause
    exit /b 0
)

taskkill /F /PID %ALVO% >nul 2>&1

if errorlevel 1 (
    echo.
    echo Nao consegui encerrar o processo %ALVO%.
    echo Tente fechar manualmente pelo Gerenciador de Tarefas.
) else (
    echo.
    echo Pronto. O servidor do site foi desligado.
)

echo.
pause
