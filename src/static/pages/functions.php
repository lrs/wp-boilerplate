<?php
/**
 * custom_theme functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package custom_theme
 */

require_once('wp_bootstrap_navwalker.php');

if ( ! function_exists( 'custom_theme_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function custom_theme_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on custom_theme, use a find and replace
	 * to change 'custom_theme' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'custom_theme', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary' ),
		'footer' => esc_html__( 'Footer Menu' )
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See https://developer.wordpress.org/themes/functionality/post-formats/
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'custom_theme_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // custom_theme_setup

add_action( 'after_setup_theme', 'custom_theme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function custom_theme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'custom_theme_content_width', 640 );
}
add_action( 'after_setup_theme', 'custom_theme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function custom_theme_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'custom_theme' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Extra Sidebar', 'custom_theme' ),
		'id'            => 'sidebar-2',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'custom_theme_widgets_init' );


 // Enqueue scripts and styles.
function custom_theme_scripts() {
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'custom_theme_scripts' );

// deregister unneeded scripts
function deregister_javascript() {
	if( !is_admin()) {
		wp_deregister_script('jquery');
	}
}
add_action( 'wp_enqueue_scripts', 'deregister_javascript', 100 );

// Replace post excerpt "more" text with a link.
function new_excerpt_more($more) {
  global $post;
  return '... <a class="moretag" href="'.get_permalink($post->ID).'">continue reading&raquo;</a>';
}
add_filter('excerpt_more', 'new_excerpt_more');

function custom_excerpt_length( $length ) {
    return 90;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

// Only allow post_type of 'post' in search results.
function SearchFilter($query) {
  if ($query->is_search) {
  $query->set('post_type', 'post');
  }
  return $query;
}
add_filter('pre_get_posts','SearchFilter');

// format link url for twitter status
function twitter_format_status($title, $url) {
  $url = str_replace(" ", "%20", $url);
  $title = str_replace(" ", "%20", $title);
  $result = 'https://twitter.com/?status='.
  esc_html(preg_replace("/[^(\x20-\x7F)]*/", "", $title . ' - ' . $url));

  return $result;
}

// Custom ajax loader
add_filter('wpcf7_ajax_loader', 'my_wpcf7_ajax_loader');
function my_wpcf7_ajax_loader () {
	return  get_bloginfo('stylesheet_directory') . '/assets/img/ajax-loader.gif';
}

// Add shortcodes to widgets
add_filter('widget_text', 'do_shortcode');

/* Custom Default Avatar */
add_filter( 'avatar_defaults', 'newCustomGravatar' );
function newCustomGravatar ($avatar_defaults) {
    $myavatar = get_bloginfo('template_directory') . '/assets/img/avatar.png';
    $avatar_defaults[$myavatar] = "custom_theme Default Avatar";
    return $avatar_defaults;
}

/*
 * Customise wp_head
 * e.g. remove_action( 'wp_head', '_wp_render_title_tag', 1);
 * See wp-includes/default-filters.php
*/
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'noindex', 1 );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );
remove_action( 'wp_head', 'locale_stylesheet' );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
