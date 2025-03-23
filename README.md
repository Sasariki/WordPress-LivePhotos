# Live Photos Block 插件使用指南

## 介绍
`Live Photos Block` 是一个自定义的 Gutenberg 区块插件，使用户能够在 WordPress 编辑器中轻松添加支持 Live Photos（实况照片）的媒体块。

---

## 使用方法

### 1. 安装并启用插件
请按照以下步骤安装并启用 `Live Photos Block` 插件：

1. 下载或创建插件文件，并放入 WordPress `wp-content/plugins` 目录下。
2. 进入 WordPress 后台，前往 **插件** 页面。
3. 找到 `Live Photos Block`，点击 **启用**。

### 2. 在编辑器中使用插件

#### **找到 Live Photos Block**
在 WordPress 区块编辑器（Gutenberg）中，搜索 `Live Photos Block`。

![示例](https://cdn.rjjr.cn/blog/2025/03/20250322132954430.png)

#### **点击使用**
点击 `Live Photos Block` 进行添加。

![示例](https://cdn.rjjr.cn/blog/2025/03/20250322133158340.png)

#### **选择 Live Photo（图片和视频）**
点击按钮，选择或上传 `Live Photo` 所需的图片和视频文件。

![示例图片](https://cdn.rjjr.cn/blog/2025/03/20250322133249575.png)

---

## 具体实现方法

### **1. 注册 Gutenberg 区块**
创建 `functions.php` 或自定义插件的 `main.php` 文件，添加以下代码以注册 Gutenberg 区块：

```php
function register_custom_live_photos_block() {
    wp_register_script(
        'custom-live-photos-block',
        get_template_directory_uri() . '/block.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        filemtime(get_template_directory() . '/block.js')
    );

    register_block_type('custom/live-photos-block', array(
        'editor_script' => 'custom-live-photos-block',
        'render_callback' => 'render_custom_live_photos_block'
    ));
}
add_action('init', 'register_custom_live_photos_block');

function render_custom_live_photos_block($attributes) {
    if (!isset($attributes['photoURL']) || !isset($attributes['videoURL'])) {
        return '';
    }

    $width = '100%';
    $height = '300px'; // 可调整默认高度

    return sprintf(
        '<div class="live-photo-wrapper" style="width:%s; height:%s; position:relative;">
            <div data-live-photo data-photo-src="%s" data-video-src="%s" style="width:100%%; height:100%%;"></div>
        </div>',
        esc_attr($width),
        esc_attr($height),
        esc_url($attributes['photoURL']),
        esc_url($attributes['videoURL'])
    );
}
```

---

### **2. 创建 JavaScript 文件 `block.js`**
在插件目录下新建 `block.js` 文件，并添加以下代码：

```js
(function (blocks, editor, element, components) {
    var el = element.createElement;
    var MediaUpload = editor.MediaUpload;
    var InspectorControls = editor.InspectorControls;
    var TextControl = components.TextControl;

    blocks.registerBlockType('custom/live-photos-block', {
        title: 'Live Photos Block',
        icon: 'camera',
        category: 'media',
        attributes: {
            photoURL: {
                type: 'string',
                default: ''
            },
            videoURL: {
                type: 'string',
                default: ''
            },
            width: {
                type: 'number',
                default: 400
            },
            height: {
                type: 'number',
                default: 300
            }
        },

        edit: function (props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            return el(
                'div',
                { className: props.className },
                el('p', {}, '选择图片和视频：'),
                el(
                    MediaUpload,
                    {
                        onSelect: function (media) {
                            setAttributes({ photoURL: media.url });
                        },
                        allowedTypes: 'image',
                        render: function (obj) {
                            return el(components.Button, {
                                className: attributes.photoURL ? 'image-button' : 'button button-large',
                                onClick: obj.open
                            },
                                !attributes.photoURL ? '选择图片' : el('img', { src: attributes.photoURL })
                            );
                        }
                    }
                ),
                el(
                    MediaUpload,
                    {
                        onSelect: function (media) {
                            setAttributes({ videoURL: media.url });
                        },
                        allowedTypes: 'video',
                        render: function (obj) {
                            return el(components.Button, {
                                className: 'button button-large',
                                onClick: obj.open
                            },
                                '选择视频'
                            );
                        }
                    }
                ),
                el(InspectorControls, {},
                    el(TextControl, {
                        label: '宽度(px)',
                        value: attributes.width,
                        onChange: function (value) {
                            setAttributes({ width: parseInt(value, 10) || 0 });
                        }
                    }),
                    el(TextControl, {
                        label: '高度(px)',
                        value: attributes.height,
                        onChange: function (value) {
                            setAttributes({ height: parseInt(value, 10) || 0 });
                        }
                    })
                )
            );
        },

        save: function () {
            return null; // 由 PHP 处理渲染
        }
    });
}(
    window.wp.blocks,
    window.wp.editor,
    window.wp.element,
    window.wp.components
));
```

---

## 总结
`Live Photos Block` 允许用户在 WordPress 区块编辑器中轻松插入支持 `Live Photo` 的媒体区域。该插件通过 PHP 处理渲染，并在 Gutenberg 编辑器中提供直观的 UI 以选择 `Live Photo` 的图片和视频。

💡 **安装并启用后，即可在区块编辑器中搜索 `Live Photos Block` 并开始使用！** 🚀
