@echo off
echo Fixing Windows setup issues...
echo.

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleared!

echo Step 3: Clearing Prisma cache...
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
echo Prisma cache cleared!

echo Step 4: Generating Prisma client...
call npx prisma generate
echo.

echo Step 5: Starting dev server...
echo Please run: npm run dev
echo.
echo Then try registering at: http://localhost:3000/auth/register
echo.
pause
