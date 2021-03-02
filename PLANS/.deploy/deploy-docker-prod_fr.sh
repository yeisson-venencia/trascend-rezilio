cd /app/
rm -rf build package-lock.json

sed -i 's/appv2.rezilio.com/appv2_fr.rezilio.com/g'  src/config/*.js
sed -i 's/client.rezilio.com/client.rezilio.fr/g'  src/config/*.js
sed -i 's/lb.rezilio.com/lb.rezilio.fr/g'  src/config/*.js
sed -i 's/.rezilio.net/_fr.rezilio.net/g'  src/config/*.js
sed -i 's/client.rezilio.com/client.rezilio.fr/g'  src/config/*.js
sed -i 's/_fr_fr.rezilio.net/_fr.rezilio.net/g'  src/config/*.js
sed -i 's/api_fr.rezilio.net/api-fr.rezilio.net/g'  src/config/*.js

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

cat<<EOF >public/.htaccess
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF



