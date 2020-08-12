echo off 

if exist filelist.txt del imageList.txt
for %%f in (%1\*.jpg) do (
   echo %%f>> imageList.txt
)

