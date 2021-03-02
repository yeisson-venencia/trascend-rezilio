cd /var/www/prudent/rezilio_plans_ui
rm -rf build package-lock.json
sudo chown -R marc.marc .
cp src/config/config-testing.js src/config/config.js
VER=$(date -u '+%Y\/%m\/%d %H:%M:%S')
sed -i "s/ZZverplaceholderZZZ/${VER}/g" src/config/config.js
yarn install
yarn build
cat<<EOF >/var/www/prudent/rezilio_plans_ui/build/.htaccess
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF
sudo chown -R www-data.www-data .
