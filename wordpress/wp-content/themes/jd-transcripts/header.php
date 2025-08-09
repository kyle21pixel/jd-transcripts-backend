<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Professional transcription services for legal, medical, and business needs. Fast, accurate, and confidential transcription with M-Pesa payment options.">
    <meta name="keywords" content="transcription, legal transcription, medical transcription, zoom transcription, Kenya, M-Pesa">
    <meta name="author" content="JD Legal Transcripts">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="JD Transcripts - Professional Transcription Services">
    <meta property="og:description" content="Secure, fast, and trusted transcription services for law, medicine, and meetings.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo home_url(); ?>">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/og-image.jpg">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="JD Transcripts - Professional Transcription Services">
    <meta name="twitter:description" content="Secure, fast, and trusted transcription services for law, medicine, and meetings.">
    <meta name="twitter:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/twitter-card.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/assets/images/apple-touch-icon.png">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer">
    
    <!-- WordPress Head -->
    <?php wp_head(); ?>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "JD Legal Transcripts",
        "description": "Professional transcription services for legal, medical, and business needs",
        "url": "<?php echo home_url(); ?>",
        "telephone": "+254712345678",
        "email": "info@jdtranscripts.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "KE"
        },
        "serviceType": [
            "Legal Transcription",
            "Medical Transcription",
            "Meeting Transcription",
            "Academic Transcription"
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Kenya"
        },
        "paymentAccepted": ["M-Pesa", "Invoice"],
        "priceRange": "$1.25-$1.75 per minute"
    }
    </script>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Navigation -->
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <?php if (has_custom_logo()) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=80&h=80&q=80" alt="JD Transcripts Logo" class="logo">
            <?php endif; ?>
            <div class="logo-text">
                <?php if (is_home() || is_front_page()) : ?>
                    <h1><?php bloginfo('name'); ?></h1>
                <?php else : ?>
                    <a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a>
                <?php endif; ?>
            </div>
        </div>
        
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'menu_class' => 'nav-menu',
            'container' => false,
            'fallback_cb' => 'jd_transcripts_fallback_menu'
        ));
        ?>
        
        <!-- Mobile Menu Toggle -->
        <div class="hamburger" id="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>

<!-- Main Content -->