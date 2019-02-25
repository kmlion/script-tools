    @echo off
	REM Get the today date
   for /f "tokens=1-4 delims=/ " %%i in ("%date%") do (
     set dow=%%i
     set month=%%j
     set day=%%k
     set year=%%l
   )
   set datestr=%day%_%month%_%year%
   echo datestr is %datestr%
   
   REM remove and create folder  
   if not exist .\bdd\%datestr% MKDIR .\bdd\%datestr%
   
   REM set parameter to trigger
   set ENVIRONEMENT=%~1
   set HOSTNAME=%~2
   set DATABASENAME=%~3
   set USERNAME=%~4
   
   set BACKUP_FILE=backup_%ENVIRONEMENT%_%datestr%.tar
   
   echo your environment name is %ENVIRONEMENT%
   echo your database name is %DATABASENAME%
   echo backup file name is %BACKUP_FILE%
   echo your username is %USERNAME%
   echo your hostname is %HOSTNAME%
   
   SET PGPASSWORD=******
   echo on  
   pg_dump -h %HOSTNAME% -p 5432 -U %USERNAME% -F t --encoding "UTF8" %DATABASENAME% > .\bdd\%datestr%\%BACKUP_FILE%
   
   	if %ERRORLEVEL% == 0 GOTO continue
	if %ERRORLEVEL% >= 1 GOTO error	
	
:continue
    echo Your file %BACKUP_FILE% was created with success
	goto exit
:error
    echo Problem encountered. Exited with status: %ERRORLEVEL%"
	goto exit
:exit
