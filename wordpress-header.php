<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- SEO Meta Tags -->
    <meta name="robots" content="index, follow">
    <meta name="author" content="JD Legal Transcripts">
    <meta name="keywords" content="transcription, legal transcription, medical transcription, audio to text, professional transcription services">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="<?php wp_title('|', true, 'right'); bloginfo('name'); ?>">
    <meta property="og:description" content="<?php bloginfo('description'); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo home_url(); ?>">
    <meta property="og:site_name" content="<?php bloginfo('name'); ?>">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php wp_title('|', true, 'right'); bloginfo('name'); ?>">
    <meta name="twitter:description" content="<?php bloginfo('description'); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
    
    <?php wp_head(); ?>
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "JD Legal Transcripts",
        "description": "Professional transcription services for legal, medical, and business needs",
        "url": "<?php echo home_url(); ?>",
        "logo": "<?php echo get_template_directory_uri(); ?>/logo-placeholder.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "<?php echo get_theme_mod('jd_phone', ''); ?>",
            "contactType": "customer service",
            "email": "<?php echo get_theme_mod('jd_email', ''); ?>"
        },
        "sameAs": [
            "<?php echo get_theme_mod('jd_facebook', ''); ?>",
            "<?php echo get_theme_mod('jd_linkedin', ''); ?>",
            "<?php echo get_theme_mod('jd_twitter', ''); ?>"
        ],
        "serviceType": [
            "Legal Transcription",
            "Medical Transcription", 
            "Zoom Meeting Transcription",
            "Academic Transcription"
        ]
    }
    </script>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Navigation -->
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <button class="logo-refresh" onclick="location.reload()" style="background:none;border:none;padding:0;cursor:pointer;">
                    <img src="<?php echo get_template_directory_uri(); ?>/logo-placeholder.svg" alt="<?php bloginfo('name'); ?>" class="logo">
                </button>
            <?php endif; ?>
            <span class="logo-text"><?php bloginfo('name'); ?></span>
        </div>
        
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'menu_class' => 'nav-menu',
            'container' => false,
            'fallback_cb' => 'jd_transcripts_fallback_menu'
        ));
        ?>
        
        <div class="nav-cta">
            <a href="<?php echo home_url('/order'); ?>" class="btn btn-primary">Order Now</a>
            <?php if (current_user_can('manage_options')): ?>
                <a href="<?php echo admin_url('admin.php?page=jd-orders'); ?>" class="btn btn-outline" style="margin-left: 10px;">
                    <i class="fas fa-user-shield"></i> Admin
                </a>
            <?php endif; ?>
        </div>
        
        <div class="hamburger" id="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>

<?php
// Fallback menu function
function jd_transcripts_fallback_menu() {
    echo '<ul class="nav-menu" id="nav-menu">';
    echo '<li class="nav-item"><a href="' . home_url() . '" class="nav-link">Home</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/services') . '" class="nav-link">Services</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/order') . '" class="nav-link">Order</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/about') . '" class="nav-link">About</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/contact') . '" class="nav-link">Contact</a></li>';
    echo '</ul>';
}
?>

<!-- Main Content -->
<main id="main-content" role="main">