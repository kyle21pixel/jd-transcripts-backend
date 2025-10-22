<?php
/**
 * Password Hash Generator
 * Use this to generate password hashes for testing
 */

// Default test passwords
$passwords = [
    'admin123',
    'trans123',
    'manager123',
    'test123'
];

echo "<h1>Password Hash Generator</h1>\n";
echo "<p>Use these hashes to create test users in your database</p>\n\n";

foreach ($passwords as $password) {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    echo "<div style='margin: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;'>\n";
    echo "  <strong>Password:</strong> $password<br>\n";
    echo "  <strong>Hash:</strong> <code style='background: white; padding: 5px;'>$hash</code>\n";
    echo "</div>\n\n";
}

// Interactive form
?>
<hr>
<h2>Generate Custom Hash</h2>
<form method="POST">
    <label>Enter Password:</label>
    <input type="text" name="custom_password" style="padding: 10px; margin: 10px; font-size: 16px;">
    <button type="submit" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Generate Hash</button>
</form>

<?php
if (isset($_POST['custom_password'])) {
    $customPassword = $_POST['custom_password'];
    $customHash = password_hash($customPassword, PASSWORD_DEFAULT);
    echo "<div style='margin: 20px; padding: 15px; background: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;'>\n";
    echo "  <strong>Your Password:</strong> $customPassword<br>\n";
    echo "  <strong>Generated Hash:</strong><br>\n";
    echo "  <code style='background: white; padding: 5px; display: block; margin-top: 10px;'>$customHash</code>\n";
    echo "</div>\n";
}
?>

<hr>
<h2>SQL Insert Statements</h2>
<p>Copy and paste these into your MySQL to create test users:</p>

<div style='background: #2c3e50; color: #ecf0f1; padding: 20px; border-radius: 5px; font-family: monospace; overflow-x: auto;'>
<?php
$adminHash = password_hash('admin123', PASSWORD_DEFAULT);
$transHash = password_hash('trans123', PASSWORD_DEFAULT);
$managerHash = password_hash('manager123', PASSWORD_DEFAULT);

echo "-- Admin User\n";
echo "INSERT INTO users (username, email, password, first_name, last_name, role, status)\n";
echo "VALUES ('admin', 'admin@jdreporting.com', '$adminHash', 'Admin', 'User', 'admin', 'active');\n\n";

echo "-- Transcriber User\n";
echo "INSERT INTO users (username, email, password, first_name, last_name, role, status)\n";
echo "VALUES ('transcriber1', 'trans1@jdreporting.com', '$transHash', 'John', 'Transcriber', 'transcriber', 'active');\n\n";

echo "-- Manager User\n";
echo "INSERT INTO users (username, email, password, first_name, last_name, role, status)\n";
echo "VALUES ('manager1', 'manager@jdreporting.com', '$managerHash', 'Jane', 'Manager', 'manager', 'active');\n";
?>
</div>

<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
    }
    h1 {
        color: #2c3e50;
        border-bottom: 3px solid #3498db;
        padding-bottom: 10px;
    }
    h2 {
        color: #34495e;
        margin-top: 30px;
    }
    code {
        word-break: break-all;
    }
</style>
