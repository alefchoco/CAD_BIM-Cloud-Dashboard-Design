; NSIS Installer Script for CAD/BIM Cloud Platform
; This script adds custom installation steps

!macro customInstall
  ; Add Start Menu entry
  CreateShortcut "$SMPROGRAMS\CAD-BIM Cloud Platform.lnk" "$INSTDIR\CAD-BIM Cloud Platform.exe"
  
  ; Add Desktop shortcut
  CreateShortcut "$DESKTOP\CAD-BIM Cloud Platform.lnk" "$INSTDIR\CAD-BIM Cloud Platform.exe"
  
  ; Register file associations
  WriteRegStr HKCR ".dwg" "" "CADBIMFile"
  WriteRegStr HKCR ".rvt" "" "CADBIMFile"
  WriteRegStr HKCR ".pdf" "" "CADBIMFile"
  WriteRegStr HKCR "CADBIMFile" "" "CAD/BIM Project File"
  WriteRegStr HKCR "CADBIMFile\DefaultIcon" "" "$INSTDIR\CAD-BIM Cloud Platform.exe,0"
  WriteRegStr HKCR "CADBIMFile\shell\open\command" "" '"$INSTDIR\CAD-BIM Cloud Platform.exe" "%1"'
!macroend

!macro customUnInstall
  ; Remove Start Menu entry
  Delete "$SMPROGRAMS\CAD-BIM Cloud Platform.lnk"
  
  ; Remove Desktop shortcut
  Delete "$DESKTOP\CAD-BIM Cloud Platform.lnk"
  
  ; Unregister file associations
  DeleteRegKey HKCR ".dwg"
  DeleteRegKey HKCR ".rvt"
  DeleteRegKey HKCR ".pdf"
  DeleteRegKey HKCR "CADBIMFile"
!macroend
