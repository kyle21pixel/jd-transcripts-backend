<?php
echo "<h1>Server Path Information</h1>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Script Name:</strong> " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Current Directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>Current File:</strong> " . __FILE__ . "</p>";

echo "<h2>Directory Contents:</h2>";
$files = scandir(__DIR__);
echo "<ul>";
foreach($files as $file) {
    if($file != '.' && $file != '..') {
        echo "<li>$file</li>";
    }
}
echo "</ul>";

echo "<h2>Test Links:</h2>";
echo '<ul>';
echo '<li><a href="index.html">index.html</a></li>';
echo '<li><a href="admin-login.html">admin-login.html</a></li>';
echo '<li><a href="test_complete_system.php">test_complete_system.php</a></li>';
echo '</ul>';
?>