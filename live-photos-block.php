<?php
/**
 * Plugin Name: Live Photos Block
 * Description: 为WordPress添加Live Photos区块,支持实况图预览
 * Version: 1.0.0
 * Author: yuazhi
 * Text Domain: live-photos-block
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    exit;
}

class Live_Photos_Block {
    
    public function __construct() {
        add_action('init', array($this, 'register_block'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_scripts'));
    }

    public function register_block() {
        register_block_type('live-photos-block/main', array(
            'editor_script' => 'live-photos-block-editor',
            'render_callback' => array($this, 'render_block')
        ));
    }

    public function enqueue_frontend_scripts() {
        // 加载 LivePhotosKit
        wp_enqueue_script(
            'livephotoskit-js', 
            'https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js',
            array(),
            '1.0.0',
            true
        );

        // 加载前端样式
        wp_enqueue_style(
            'live-photos-block-style',
            plugins_url('css/editor-style.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'css/editor-style.css')
        );
    }

    public function enqueue_editor_scripts() {
        // 添加自定义样式
        wp_enqueue_style(
            'live-photos-block-editor-style',
            plugins_url('css/editor-style.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'css/editor-style.css')
        );

        // 先加载 LivePhotosKit
        wp_enqueue_script(
            'livephotoskit-js-editor', 
            'https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js',
            array(),
            '1.0.0',
            false
        );

        // 然后加载编辑器脚本
        wp_enqueue_script(
            'live-photos-block-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'livephotoskit-js-editor'),
            filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
        );
    }

    public function render_block($attributes) {
        if (!isset($attributes['photoURL']) || !isset($attributes['videoURL'])) {
            return '';
        }

        $wrapper_attributes = get_block_wrapper_attributes(array(
            'class' => 'align' . (isset($attributes['align']) ? $attributes['align'] : 'none')
        ));

        $width = isset($attributes['width']) ? intval($attributes['width']) : 800;

        // 添加响应式样式
        $style = sprintf(
            '<style>
                @media (max-width: %1$dpx) {
                    #live-photo-%2$s {
                        max-width: 100%% !important;
                    }
                }
            </style>',
            $width,
            uniqid()
        );

        $output = <<<HTML
            {$style}
            <div {$wrapper_attributes}>
                <div class="live-photo-wrapper" style="width:100%; max-width:{$width}px; margin:0 auto;">
                    <img class="preview-image" 
                         src="{$attributes['photoURL']}" 
                         alt="Live Photo" />
                    <div class="live-photo-container">
                        <div data-live-photo 
                             data-photo-src="{$attributes['photoURL']}" 
                             data-video-src="{$attributes['videoURL']}" 
                             style="width:100%; height:100%;">
                        </div>
                    </div>
                </div>
                <script>
                    (function() {
                        function initializeLivePhotos() {
                            if (!document.querySelector('.live-photo-wrapper')) {
                                setTimeout(initializeLivePhotos, 100);
                                return;
                            }

                            if (typeof LivePhotosKit === 'undefined') {
                                var script = document.createElement('script');
                                script.src = 'https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js';
                                script.onload = function() {
                                    initLivePhotosKit();
                                };
                                document.head.appendChild(script);
                            } else {
                                initLivePhotosKit();
                            }
                        }

                        function initLivePhotosKit() {
                            try {
                                if (typeof LivePhotosKit.Player === 'function') {
                                    var containers = document.querySelectorAll('.live-photo-container');
                                    if (containers.length === 0) {
                                        setTimeout(initLivePhotosKit, 100);
                                        return;
                                    }

                                    containers.forEach(function(container) {
                                        var element = container.querySelector('[data-live-photo]');
                                        if (element && !element._player) {
                                            element._player = new LivePhotosKit.Player(element);
                                        }
                                    });

                                    var wrapper = document.querySelector('.live-photo-wrapper');
                                    if (wrapper) {
                                        wrapper.classList.add('initialized');
                                    }
                                }
                            } catch(e) {
                                console.warn('LivePhotosKit initialization failed:', e);
                            }
                        }

                        // 立即执行初始化
                        initializeLivePhotos();

                        // PJAX 事件处理
                        ['pjax:complete', 'pjax:end'].forEach(function(eventName) {
                            document.addEventListener(eventName, function() {
                                setTimeout(initializeLivePhotos, 100);
                            });
                        });
                    })();
                </script>
            </div>
HTML;

        return $output;
    }
}

// 初始化插件
new Live_Photos_Block(); 
