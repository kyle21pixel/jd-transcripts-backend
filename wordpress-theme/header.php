<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Header -->
<header class="site-header">
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <div class="logo">
                        <i class="fas fa-file-alt"></i>
                    </div>
                <?php endif; ?>
                
                <div class="logo-text-container">
                    <span class="logo-text"><?php bloginfo('name'); ?></span>
                    <?php if (get_bloginfo('description')) : ?>
                        <span class="logo-tagline"><?php bloginfo('description'); ?></span>
                    <?php endif; ?>
                </div>
            </div>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'nav-menu',
                'container' => false,
                'fallback_cb' => 'jd_fallback_menu',
            ));
            ?>
            
            <div class="nav-cta">
                <a href="<?php echo esc_url(get_permalink(get_page_by_path('order'))); ?>" class="btn btn-primary">Order Now</a>
                <?php if (is_user_logged_in()) : ?>
                    <a href="<?php echo admin_url(); ?>" class="btn btn-outline">
                        <i class="fas fa-user-shield"></i> Dashboard
                    </a>
                <?php else : ?>
                    <a href="<?php echo wp_login_url(); ?>" class="btn btn-outline">
                        <i class="fas fa-user-shield"></i> Login
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
</header>

<?php
/**
 * Fallback menu if no menu is assigned
 */
function jd_fallback_menu() {
    echo '<ul class="nav-menu">';
    echo '<li class="nav-item"><a href="' . home_url() . '" class="nav-link">Home</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/services') . '" class="nav-link">Services</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/order') . '" class="nav-link">Order</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/about') . '" class="nav-link">About</a></li>';
    echo '<li class="nav-item"><a href="' . home_url('/contact') . '" class="nav-link">Contact</a></li>';
    echo '</ul>';
}
?>