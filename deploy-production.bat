@echo off
echo.
echo ========================================
echo   Deploying to Vercel Production
echo ========================================
echo.
echo Triggering deployment via Deploy Hook...
echo.

curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_otrBaBAfHlLCC1C6ZiFckID8Q8wN/Io15upAAQ2"

echo.
echo.
echo ========================================
echo   Deployment triggered!
echo ========================================
echo.
echo Monitor progress at:
echo https://vercel.com/vibecodium/affiliate-aggregator/deployments
echo.
echo Check health in 2 minutes:
echo curl https://affiliate-aggregator-five.vercel.app/api/health
echo.
pause
