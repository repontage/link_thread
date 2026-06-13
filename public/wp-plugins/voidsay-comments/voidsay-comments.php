<?php
/**
 * Plugin Name: VoidSay Comments
 * Plugin URI: https://voidsay.com
 * Description: Embed VoidSay — the universal, ad-free commenting platform — on any WordPress post or page. Just add the [voidsay] shortcode or use the Gutenberg block.
 * Version: 1.0.0
 * Author: VoidSay
 * Author URI: https://voidsay.com
 * License: MIT
 * Text Domain: voidsay-comments
 *
 * @package VoidSayComments
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Register the shortcode [voidsay]
function voidsay_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'url'   => '', // Optional: override the URL
            'width' => '100%',
            'height' => '400px',
        ),
        $atts,
        'voidsay'
    );

    // Use the current post/page URL if no URL is specified
    $page_url = $atts['url'] ? esc_url($atts['url']) : get_permalink();

    // Build the iframe embed
    $iframe_url = 'https://voidsay.com/embed?url=' . urlencode($page_url);
    $width  = esc_attr($atts['width']);
    $height = esc_attr($atts['height']);

    ob_start();
    ?>
    <div class="voidsay-comments-wrapper" style="width:<?php echo $width; ?>; margin: 2em 0;">
        <iframe
            src="<?php echo esc_url($iframe_url); ?>"
            width="100%"
            height="<?php echo $height; ?>"
            frameborder="0"
            style="border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; background: #1a1a2e;"
            title="VoidSay Comments"
        ></iframe>
        <div style="text-align: center; padding: 6px 0; font-size: 12px; color: #94a3b8;">
            Powered by <a href="https://voidsay.com" target="_blank" rel="noopener" style="color: #0066cc; text-decoration: none;">VoidSay</a> — Universal, Ad-Free Commenting
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('voidsay', 'voidsay_shortcode');

// Register Gutenberg block
function voidsay_register_block() {
    // Only register if Gutenberg is available
    if (!function_exists('register_block_type')) {
        return;
    }

    wp_register_script(
        'voidsay-block-editor',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor'),
        '1.0.0'
    );

    register_block_type('voidsay/comments', array(
        'editor_script'   => 'voidsay-block-editor',
        'render_callback' => 'voidsay_shortcode',
        'attributes'      => array(
            'url'    => array('type' => 'string', 'default' => ''),
            'width'  => array('type' => 'string', 'default' => '100%'),
            'height' => array('type' => 'string', 'default' => '400px'),
        ),
    ));
}
add_action('init', 'voidsay_register_block');

// Add settings link on plugin page
function voidsay_plugin_action_links($links) {
    $settings_link = '<a href="https://voidsay.com" target="_blank">VoidSay Homepage</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'voidsay_plugin_action_links');
