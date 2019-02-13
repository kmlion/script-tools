@echo off
set SFS_dir=%~1

if [%1]==[] goto USAGE


REM Push to SFS directory
   
  xcopy ".\bdd\*" "%SFS_DIR%" /b/v/y /S 

:USAGE
echo.
echo ########## ERROR ##########
echo SFS directory's missing(s) missing in %0 call
echo.
exit /B 1