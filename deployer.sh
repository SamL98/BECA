git add .
git commit -am "$1"
git push -u origin master

host="igb.cs.iupui.edu"
path="/var/www/nodejs/"
full_path="${host}:${path}"

for f in app.js DBManager.js colortable.py package.json roi_locator.py ROIid.csv; do
  scp $f $igb_user@$full_path
done
scp -r public $igb_user@full_path
scp -r node_modules $igb_user@full_path
