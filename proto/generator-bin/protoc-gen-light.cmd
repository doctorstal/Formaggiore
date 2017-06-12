@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\protoc-get-light.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\protoc-get-light.js" %*
)
