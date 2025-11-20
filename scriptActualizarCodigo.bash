sudo su - ec2-user
sudo yum update -y
cd /home/ec2-user/web-tier/
git pull
pm2 restart all
pm2 save
sudo systemctl restart nginx