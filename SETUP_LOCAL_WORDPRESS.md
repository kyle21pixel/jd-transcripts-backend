# 🏠 **LOCAL WORDPRESS SETUP GUIDE**

## 📋 **STEP-BY-STEP INSTRUCTIONS:**

### **Step 1: Install XAMPP** ✅
1. **Download XAMPP** from: https://www.apachefriends.org/download.html
2. **Run installer** and install to default location (`C:\xampp`)
3. **Start XAMPP Control Panel**
4. **Start Apache and MySQL** services (click Start buttons)

### **Step 2: Download WordPress** ✅
1. **Download WordPress** from: https://wordpress.org/download/
2. **Extract the ZIP file**
3. **Copy all WordPress files** to: `C:\xampp\htdocs\jd-transcripts\`

### **Step 3: Create Database**
1. **Open phpMyAdmin:** http://localhost/phpmyadmin
2. **Click "New"** on the left sidebar
3. **Database name:** `jd_transcripts`
4. **Collation:** `utf8mb4_general_ci`
5. **Click "Create"**

### **Step 4: Install WordPress**
1. **Open browser:** http://localhost/jd-transcripts
2. **Select language:** English
3. **Click "Let's go!"**
4. **Database details:**
   - **Database Name:** `jd_transcripts`
   - **Username:** `root`
   - **Password:** (leave empty)
   - **Database Host:** `localhost`
   - **Table Prefix:** `wp_`
5. **Click "Submit"**
6. **Click "Run the installation"**
7. **Fill site information:**
   - **Site Title:** JD Legal Transcripts
   - **Username:** admin
   - **Password:** (create strong password)
   - **Email:** your-email@domain.com
8. **Click "Install WordPress"**

### **Step 5: Install JD Transcripts Theme**
1. **Copy theme folder** from: `c:\Users\Kyle\jd 3\wordpress\wp-content\themes\jd-transcripts\`
2. **To:** `C:\xampp\htdocs\jd-transcripts\wp-content\themes\jd-transcripts\`
3. **Login to WordPress Admin:** http://localhost/jd-transcripts/wp-admin
4. **Go to:** Appearance > Themes
5. **Activate:** JD Transcripts Professional

### **Step 6: Create Admin Dashboard Page**
1. **Go to:** Pages > Add New
2. **Title:** Admin Dashboard
3. **Page Attributes > Template:** Admin Dashboard
4. **Slug:** admin (in permalink settings)
5. **Click "Publish"**

### **Step 7: Test Everything**
1. **Visit homepage:** http://localhost/jd-transcripts
2. **Submit test order** on the homepage
3. **Check admin dashboard:** http://localhost/jd-transcripts/admin
4. **Verify email notifications** (check console for now)

---

## 🎯 **QUICK CHECKLIST:**

- [ ] XAMPP installed and running (Apache + MySQL)
- [ ] WordPress downloaded and extracted to `C:\xampp\htdocs\jd-transcripts\`
- [ ] Database `jd_transcripts` created in phpMyAdmin
- [ ] WordPress installation completed
- [ ] JD Transcripts theme copied and activated
- [ ] Admin Dashboard page created with correct template
- [ ] Test order submitted successfully
- [ ] Admin dashboard accessible and working

---

## 🔧 **TROUBLESHOOTING:**

### **XAMPP Issues:**
- **Port 80 in use:** Stop IIS or change Apache port
- **MySQL won't start:** Check if MySQL service is running
- **Permission errors:** Run XAMPP as administrator

### **WordPress Issues:**
- **Can't connect to database:** Check database name and credentials
- **Theme not showing:** Verify theme folder location and permissions
- **Admin page not working:** Check template assignment

### **Theme Issues:**
- **Orders not saving:** Check JavaScript console for errors
- **Emails not sending:** Check PHP error logs in XAMPP
- **Styling issues:** Clear browser cache

---

## 📞 **NEED HELP?**

If you encounter any issues:
1. **Check XAMPP logs:** `C:\xampp\apache\logs\error.log`
2. **Check WordPress debug:** Add `define('WP_DEBUG', true);` to `wp-config.php`
3. **Browser console:** Press F12 to check for JavaScript errors

---

## 🎉 **SUCCESS URLS:**

Once everything is set up:
- **🏠 Website:** http://localhost/jd-transcripts
- **🎛️ WordPress Admin:** http://localhost/jd-transcripts/wp-admin
- **📊 Admin Dashboard:** http://localhost/jd-transcripts/admin
- **💾 phpMyAdmin:** http://localhost/phpmyadmin

**Your local JD Transcripts WordPress site will be ready for testing!** 🚀✨