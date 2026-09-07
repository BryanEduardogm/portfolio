' ==========================================================================
'  PORTFOLIO — inicia o site e abre no navegador.
'
'  Sobe o servidor escondido (sem janela preta de terminal), espera ele
'  responder de verdade e so entao abre o Chrome. Se algo der errado,
'  aparece uma mensagem dizendo o que fazer — em vez de abrir uma pagina
'  de erro sem explicacao.
'
'  Passe /semnavegador para so subir o servidor, sem abrir o Chrome.
'
'  Obs.: sem acentos de proposito. O Windows le arquivos .vbs como ANSI,
'  e acento salvo em UTF-8 apareceria como caractere estranho na mensagem.
' ==========================================================================

Option Explicit

Const PORTA = 4173
Const ENDERECO = "http://localhost:4173"
Const TITULO = "Portfolio"

Dim fso, shell, pasta, pronto, i, abrirNavegador

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)

abrirNavegador = True
If WScript.Arguments.Count > 0 Then
    If LCase(WScript.Arguments(0)) = "/semnavegador" Then abrirNavegador = False
End If

' --- O servidor esta mesmo aqui? -----------------------------------------
If Not fso.FileExists(fso.BuildPath(pasta, "servidor.js")) Then
    MsgBox "Nao encontrei o arquivo servidor.js nesta pasta." & vbCrLf & vbCrLf & _
           "Este atalho precisa ficar dentro da pasta portfolio, junto com o site.", _
           vbCritical, TITULO
    WScript.Quit 1
End If

' --- Ja tem alguem rodando na porta? -------------------------------------
' Se sim, nao sobe outro servidor: so abre o navegador.
If Responde(ENDERECO) Then
    If abrirNavegador Then AbreNavegador ENDERECO
    WScript.Quit 0
End If

' --- Sobe o servidor escondido -------------------------------------------
shell.CurrentDirectory = pasta
shell.Run "node servidor.js", 0, False

' --- Espera ele responder (ate ~8 segundos) ------------------------------
' Melhor que esperar um tempo fixo: em maquina lenta o tempo fixo abre o
' navegador cedo demais e mostra "nao foi possivel acessar este site".
pronto = False
For i = 1 To 16
    WScript.Sleep 500
    If Responde(ENDERECO) Then
        pronto = True
        Exit For
    End If
Next

If Not pronto Then
    MsgBox "O servidor do site nao subiu." & vbCrLf & vbCrLf & _
           "Causa mais provavel: o Node.js nao esta instalado neste computador." & vbCrLf & _
           "Baixe em https://nodejs.org (versao LTS) e tente de novo." & vbCrLf & vbCrLf & _
           "Se o Node ja estiver instalado, veja se a porta " & PORTA & " nao esta" & vbCrLf & _
           "ocupada por outro programa. Rode parar-site.bat e tente de novo." & vbCrLf & vbCrLf & _
           "Voce tambem pode abrir o index.html direto, com dois cliques:" & vbCrLf & _
           "o site funciona sem servidor nenhum.", _
           vbExclamation, TITULO
    WScript.Quit 1
End If

If abrirNavegador Then AbreNavegador ENDERECO
WScript.Quit 0


' ==========================================================================
'  Funcoes auxiliares
' ==========================================================================

' Pergunta ao servidor se ele ja esta de pe.
Function Responde(url)
    Dim req
    Responde = False
    On Error Resume Next
    Set req = CreateObject("MSXML2.XMLHTTP")
    req.Open "GET", url, False
    req.Send
    If Err.Number = 0 Then
        If req.Status = 200 Then Responde = True
    End If
    Err.Clear
    On Error GoTo 0
End Function

' Abre no Chrome se ele existir; senao, no navegador padrao do Windows.
Sub AbreNavegador(url)
    Dim caminhos, caminho, achado, sh, arquivos
    Set sh = CreateObject("WScript.Shell")
    Set arquivos = CreateObject("Scripting.FileSystemObject")

    caminhos = Array( _
        sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\Google\Chrome\Application\chrome.exe", _
        sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Google\Chrome\Application\chrome.exe", _
        sh.ExpandEnvironmentStrings("%LocalAppData%") & "\Google\Chrome\Application\chrome.exe" _
    )

    achado = ""
    For Each caminho In caminhos
        If arquivos.FileExists(caminho) Then
            achado = caminho
            Exit For
        End If
    Next

    If achado <> "" Then
        sh.Run """" & achado & """ " & url, 1, False
    Else
        sh.Run url, 1, False
    End If
End Sub
