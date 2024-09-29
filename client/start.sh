echo "====================================start git pull===================================="
git pull
echo "====================================start npm install===================================="
rm -rf node_modules/
rm -f  package-lock.json
npm install -s
echo "====================================start build===================================="
npm run build:prod
echo "====================================start transfer dist files===================================="
\cp -rf  dist ../
