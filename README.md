# 🚀 AWS EC2 Static Website Hosting with IAM Access Control

## 🔗 Live Project

👉 http://3.151.244.254

---

## 📌 Project Overview

This project demonstrates how to deploy a static website (Quiz Application) on an AWS EC2 instance using Apache web server and configure IAM users with different access levels.

---

## ⚙️ Technologies Used

* AWS EC2 (Elastic Compute Cloud)
* AWS IAM (Identity and Access Management)
* Apache Web Server
* HTML, CSS, JavaScript
* GitHub

---

## 🌐 Deployment Details

* EC2 Instance Type: t2.micro (Free Tier)
* OS: Ubuntu
* Web Server: Apache2
* Public Access via Elastic IP

---

## 📸 Screenshots

### 🖥️ EC2 Instance (Admin Access)

* Shows running instance with public details
  ![EC2 Screenshot](./your-image-name.png)

---

### 🔐 IAM User 1 (No Access)

* User: `user-no-access`
* Result: ❌ Cannot access EC2 services
  ![EC2 Screenshot](./your-image-name.png)

---

### 🔓 IAM User 2 (EC2 Access)

* User: `fullaccess`
* Policy: `AmazonEC2FullAccess`
* Result: ✅ Can view EC2 instances
 ![EC2 Screenshot](./your-image-name.png)

---

## 🔐 IAM Configuration

### 👤 User 1: user-no-access

* No policies attached
* Restricted from accessing EC2 resources

### 👤 User 2: fullaccess

* Attached policy: AmazonEC2FullAccess
* Full access to EC2 dashboard and instances

---

## ⚠️ Challenges Faced

* ❌ SSH connection issue (`chmod` not working on PowerShell)
* ❌ .pem file not found due to incorrect directory
* ❌ Git clone created subfolder instead of root deployment
* ❌ Initial confusion with AWS regions during IAM login
* ❌ Security group configuration (HTTP port 80 not enabled initially)

---

## ✅ Solutions Implemented

* ✔ Used Git Bash to run SSH commands properly
* ✔ Corrected file path for `.pem` key
* ✔ Used `mv *` to move project files to `/var/www/html`
* ✔ Ensured correct region selection (US East - Ohio)
* ✔ Enabled HTTP (Port 80) in security group

---

## 📌 Conclusion

Successfully deployed a static quiz website on AWS EC2 with proper IAM access control. This project helped in understanding cloud deployment, server configuration, and secure access management.

---

## 👨‍💻 Author

**Arpit Kumar**
B.Tech CSE Student
