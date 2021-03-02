cd /app/
rm -rf build package-lock.json
cp src/config/config-prod.js src/config/config.js
VER=$(date -u '+%Y\/%m\/%d %H:%M:%S')
sed -i "s/ZZverplaceholderZZZ/${VER}/g" src/config/config.js
yarn install
yarn build
cat<<EOF >build/.htaccess
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF
cp -f build/.htaccess public/.htaccess
