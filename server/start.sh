echo "====================================start git pull===================================="
git pull
echo "====================================start npm install===================================="
rm -rf node_modules/
rm -f  package-lock.json
npm install -s
echo "====================================PM2 restart===================================="
pm2 restart backend-server
