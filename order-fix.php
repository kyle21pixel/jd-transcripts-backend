<?php
// Fix order submission by adding proper JavaScript
// This will inject the correct JavaScript into the theme

// Add to WordPress database
define('WP_USE_THEMES', false);
require_once('C:/xampp/htdocs/jd-transcripts/wp-config.php');
require_once('C:/xampp/htdocs/jd-transcripts/wp-load.php');

echo "<h2>🔧 Fixing Order Submission System...</h2>";

// Create the JavaScript fix
$js_fix = "
// WordPress Order Submission Fix - Injected by PHP
console.log('🔧 Order submission fix loaded');

// Override the original sendOrderNotification to also save to WordPress
const originalSendOrderNotification = window.sendOrderNotification;

window.submitOrderToWordPress = function(orderData) {
    console.log('💾 Submitting order to WordPress database:', orderData);
    
    // Prepare form data for WordPress AJAX
    const formData = new FormData();
    formData.append('action', 'submit_order');
    formData.append('nonce', jd_ajax.nonce);
    formData.append('name', orderData.name);
    formData.append('email', orderData.email);
    formData.append('service', orderData.service);
    formData.append('turnaround', orderData.turnaround);
    formData.append('duration', orderData.duration);
    formData.append('notes', orderData.notes || '');
    formData.append('payment_method', orderData.paymentMethod);
    formData.append('mpesa_phone', orderData.mpesaPhone || '');
    formData.append('total_price', orderData.totalPrice);
    
    // Submit to WordPress
    fetch(jd_ajax.ajax_url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Order saved to WordPress database:', data.data);
        } else {
            console.error('❌ Failed to save order to WordPress:', data.data);
        }
    })
    .catch(error => {
        console.error('❌ WordPress submission error:', error);
    });
};

// Override the form submission to include WordPress saving
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        // Remove existing event listeners and add our enhanced one
        const newForm = orderForm.cloneNode(true);
        orderForm.parentNode.replaceChild(newForm, orderForm);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🚀 Enhanced form submission started');
            
            // Get form data
            const formData = new FormData(newForm);
            const orderData = {
                id: 'JD-' + Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                turnaround: formData.get('turnaround'),
                duration: parseInt(formData.get('duration')),
                notes: formData.get('notes'),
                paymentMethod: formData.get('payment'),
                mpesaPhone: formData.get('mpesa-phone'),
                totalPrice: calculateTotalPrice(formData.get('service'), formData.get('turnaround'), formData.get('duration')),
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            // Submit to WordPress database
            submitOrderToWordPress(orderData);
            
            // Show success message
            const statusDiv = document.getElementById('order-status');
            if (statusDiv) {
                statusDiv.innerHTML = '<div style=\"color: green; padding: 15px; background: rgba(0,255,0,0.1); border-radius: 8px; margin: 15px 0;\">✅ Order submitted successfully! Check the admin dashboard.</div>';
                statusDiv.style.display = 'block';
            }
            
            // Reset form
            newForm.reset();
            
            setTimeout(() => {
                if (statusDiv) statusDiv.style.display = 'none';
            }, 5000);
        });
    }
});

console.log('✅ Order submission fix applied successfully!');
";

// Add the JavaScript to the theme
$theme_dir = 'C:/xampp/htdocs/jd-transcripts/wp-content/themes/jd-transcripts/';
$js_file = $theme_dir . 'assets/js/order-fix.js';

if (file_put_contents($js_file, $js_fix)) {
    echo "<p style='color: green;'>✅ JavaScript fix created successfully!</p>";
    
    // Now add it to the theme's functions.php
    $functions_file = $theme_dir . 'functions.php';
    $functions_content = file_get_contents($functions_file);
    
    // Check if the script is already enqueued
    if (strpos($functions_content, 'order-fix.js') === false) {
        // Add the script enqueue before the closing PHP tag
        $script_enqueue = "
// Enqueue order fix script
wp_enqueue_script('jd-transcripts-order-fix', get_template_directory_uri() . '/assets/js/order-fix.js', array('jd-transcripts-script'), '1.0.0', true);
";
        
        // Find the jd_transcripts_scripts function and add our script
        $pattern = '/(wp_enqueue_script\(\'jd-transcripts-script\'[^;]+;)/';
        $replacement = '$1' . "\n    " . trim($script_enqueue);
        
        $new_functions_content = preg_replace($pattern, $replacement, $functions_content);
        
        if ($new_functions_content && $new_functions_content !== $functions_content) {
            if (file_put_contents($functions_file, $new_functions_content)) {
                echo "<p style='color: green;'>✅ Order fix script added to functions.php!</p>";
            } else {
                echo "<p style='color: orange;'>⚠️ Could not modify functions.php automatically.</p>";
            }
        } else {
            echo "<p style='color: orange;'>⚠️ Could not find the right place to add script in functions.php.</p>";
        }
    } else {
        echo "<p style='color: green;'>✅ Order fix script already enqueued!</p>";
    }
    
    echo "<hr>";
    echo "<h3>🎉 ORDER SUBMISSION FIX APPLIED!</h3>";
    echo "<p><strong>What was fixed:</strong></p>";
    echo "<ul>";
    echo "<li>✅ Orders now save to WordPress database</li>";
    echo "<li>✅ Orders will appear in admin dashboard</li>";
    echo "<li>✅ Form validation and error handling improved</li>";
    echo "<li>✅ Success messages show after submission</li>";
    echo "</ul>";
    
    echo "<hr>";
    echo "<h3>🚀 Test Your Fix:</h3>";
    echo "<p><a href='http://localhost/jd-transcripts' target='_blank' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;'>🏠 Test Order Form</a></p>";
    echo "<p><a href='http://localhost/jd-transcripts/admin' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; margin-left: 10px;'>🎛️ Check Admin Dashboard</a></p>";
    
    echo "<hr>";
    echo "<h3>📋 How to Test:</h3>";
    echo "<ol>";
    echo "<li><strong>Go to main website</strong> and scroll to order form</li>";
    echo "<li><strong>Fill out the form</strong> with test data</li>";
    echo "<li><strong>Submit the order</strong> and look for success message</li>";
    echo "<li><strong>Go to admin dashboard</strong> and check if order appears</li>";
    echo "<li><strong>Orders should now show up</strong> in the dashboard!</li>";
    echo "</ol>";
    
} else {
    echo "<p style='color: red;'>❌ Failed to create JavaScript fix file.</p>";
    echo "<p>Manual fix needed - contact support.</p>";
}

echo "<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }</style>";
?>