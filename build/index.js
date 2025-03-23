/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external ["wp","element"]
const external_wp_element_namespaceObject = window["wp"]["element"];
;// CONCATENATED MODULE: external ["wp","blocks"]
const external_wp_blocks_namespaceObject = window["wp"]["blocks"];
;// CONCATENATED MODULE: external ["wp","blockEditor"]
const external_wp_blockEditor_namespaceObject = window["wp"]["blockEditor"];
;// CONCATENATED MODULE: external ["wp","components"]
const external_wp_components_namespaceObject = window["wp"]["components"];

;// CONCATENATED MODULE: ./src/index.js
const { ResizableBox } = wp.components;

(0,external_wp_blocks_namespaceObject.registerBlockType)('live-photos-block/main', {
    title: 'Live Photos Block',
    icon: 'format-video',
    category: 'media',
    attributes: {
        photoURL: {
            type: 'string'
        },
        videoURL: {
            type: 'string'
        },
        width: {
            type: 'number',
            default: 800  // 设置默认宽度为800px
        },
        height: {
            type: 'string',
            default: 'auto'
        },
        align: {
            type: 'string',
            default: 'none'
        },
        sizeSlug: {
            type: 'string',
            default: 'large'
        }
    },
    
    supports: {
        align: true, // 支持对齐选项
        alignWide: true, // 支持宽对齐
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const blockProps = wp.blockEditor.useBlockProps();
        const { InspectorControls } = wp.blockEditor;
        const { PanelBody, SelectControl } = wp.components;
        
        // 添加 useEffect 钩子来初始化 LivePhotosKit
        const { useEffect, useRef } = wp.element;
        const initializeTimeout = useRef(null);

        useEffect(() => {
            if (attributes.photoURL && attributes.videoURL) {
                // 清除之前的定时器
                if (initializeTimeout.current) {
                    clearTimeout(initializeTimeout.current);
                }
                
                // 设置新的定时器
                initializeTimeout.current = setTimeout(() => {
                    try {
                        if (window.LivePhotosKit && typeof window.LivePhotosKit.initialize === 'function') {
                            window.LivePhotosKit.initialize();
                            // 添加初始化完成的标记
                            const wrapper = document.querySelector('.live-photo-wrapper');
                            if (wrapper) {
                                wrapper.classList.add('initialized');
                            }
                        }
                    } catch (e) {
                        console.warn('LivePhotosKit initialization failed:', e);
                    }
                }, 1000);
            }

            return () => {
                if (initializeTimeout.current) {
                    clearTimeout(initializeTimeout.current);
                }
            };
        }, [attributes.photoURL, attributes.videoURL]);

        return (0,external_wp_element_namespaceObject.createElement)(
            external_wp_element_namespaceObject.Fragment,
            null,
            (0,external_wp_element_namespaceObject.createElement)(
                InspectorControls,
                null,
                (0,external_wp_element_namespaceObject.createElement)(
                    PanelBody,
                    { title: '图片设置' },
                    (0,external_wp_element_namespaceObject.createElement)(
                        SelectControl,
                        {
                            label: '图片尺寸',
                            value: attributes.sizeSlug,
                            options: [
                                { label: '缩略图', value: 'thumbnail' },
                                { label: '中等', value: 'medium' },
                                { label: '大', value: 'large' },
                                { label: '完整尺寸', value: 'full' }
                            ],
                            onChange: (sizeSlug) => setAttributes({ sizeSlug })
                        }
                    )
                )
            ),
            (0,external_wp_element_namespaceObject.createElement)(
                "div",
                blockProps,
                (0,external_wp_element_namespaceObject.createElement)(
                    "div",
                    { style: { marginBottom: '20px' } },
                    (0,external_wp_element_namespaceObject.createElement)(
                        external_wp_blockEditor_namespaceObject.MediaUploadCheck,
                        null,
                        (0,external_wp_element_namespaceObject.createElement)(
                            external_wp_blockEditor_namespaceObject.MediaUpload,
                            {
                                onSelect: (media) => {
                                    // 获取选定尺寸的URL
                                    const url = media.sizes && media.sizes[attributes.sizeSlug] 
                                        ? media.sizes[attributes.sizeSlug].url 
                                        : media.url;
                                    
                                    // 获取图片宽度
                                    let width = media.sizes && media.sizes[attributes.sizeSlug] 
                                        ? parseInt(media.sizes[attributes.sizeSlug].width) 
                                        : parseInt(media.width);
                                    
                                    // 设置最大初始宽度为800px
                                    const maxInitialWidth = 800;
                                    if (width > maxInitialWidth) {
                                        width = maxInitialWidth;
                                    }
                                    
                                    setAttributes({ 
                                        photoURL: url,
                                        width: width
                                    });
                                },
                                allowedTypes: ['image'],
                                render: ({open}) => (0,external_wp_element_namespaceObject.createElement)(
                                    external_wp_components_namespaceObject.Button,
                                    {
                                        onClick: open,
                                        isPrimary: true
                                    },
                                    attributes.photoURL ? '更换静态图片' : '选择静态图片'
                                )
                            }
                        )
                    ),
                    (0,external_wp_element_namespaceObject.createElement)(
                        external_wp_blockEditor_namespaceObject.MediaUploadCheck,
                        null,
                        (0,external_wp_element_namespaceObject.createElement)(
                            external_wp_blockEditor_namespaceObject.MediaUpload,
                            {
                                onSelect: (media) => setAttributes({ videoURL: media.url }),
                                allowedTypes: ['video'],
                                render: ({open}) => (0,external_wp_element_namespaceObject.createElement)(
                                    external_wp_components_namespaceObject.Button,
                                    {
                                        onClick: open,
                                        isPrimary: true,
                                        style: { marginLeft: '10px' }
                                    },
                                    attributes.videoURL ? '更换视频' : '选择视频'
                                )
                            }
                        )
                    )
                ),
                attributes.photoURL && attributes.videoURL && (0,external_wp_element_namespaceObject.createElement)(
                    "div",
                    blockProps,
                    (0,external_wp_element_namespaceObject.createElement)(
                        ResizableBox,
                        {
                            size: {
                                width: attributes.width || 800,
                            },
                            minWidth: "200",
                            maxWidth: "1200",
                            enable: {
                                top: false,
                                right: true,
                                bottom: false,
                                left: true,
                                topRight: false,
                                bottomRight: false,
                                bottomLeft: false,
                                topLeft: false,
                            },
                            onResizeStop: (event, direction, elt, delta) => {
                                let newWidth = parseInt(attributes.width) + delta.width;
                                // 确保宽度在有效范围内
                                newWidth = Math.min(Math.max(newWidth, 200), 1200);
                                
                                // 添加过渡效果
                                const wrapper = document.querySelector('.live-photo-wrapper');
                                if (wrapper) {
                                    wrapper.style.transition = 'width 0.3s ease';
                                    setTimeout(() => {
                                        wrapper.style.transition = '';
                                    }, 300);
                                }
                                
                                setAttributes({
                                    width: newWidth
                                });
                            },
                            showHandle: true,
                            className: "live-photo-resizable"
                        },
                        (0,external_wp_element_namespaceObject.createElement)(
                            "div",
                            {
                                className: "live-photo-wrapper",
                                style: { 
                                    width: '100%'
                                }
                            },
                            // 预览图片
                            (0,external_wp_element_namespaceObject.createElement)(
                                "img",
                                {
                                    className: "preview-image",
                                    src: attributes.photoURL,
                                    alt: "Live Photo Preview"
                                }
                            ),
                            // Live Photo 容器
                            (0,external_wp_element_namespaceObject.createElement)(
                                "div",
                                {
                                    className: "live-photo-container"
                                },
                                (0,external_wp_element_namespaceObject.createElement)(
                                    "div",
                                    {
                                        "data-live-photo": "",
                                        "data-photo-src": attributes.photoURL,
                                        "data-video-src": attributes.videoURL,
                                        style: { 
                                            width: '100%',
                                            height: '100%'
                                        }
                                    }
                                )
                            )
                        )
                    )
                )
            )
        );
    },
    
    save: function() {
        return null; // 使用PHP端渲染
    }
});

/******/ })()
; 