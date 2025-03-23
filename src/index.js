const { registerBlockType } = wp.blocks;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { Button, TextControl } = wp.components;

registerBlockType('live-photos-block/main', {
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
            type: 'string',
            default: '100%'
        },
        height: {
            type: 'string',
            default: '300px'
        }
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        
        return (
            <div>
                <div style={{marginBottom: '20px'}}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(media) => setAttributes({ photoURL: media.url })}
                            allowedTypes={['image']}
                            render={({open}) => (
                                <Button 
                                    onClick={open}
                                    isPrimary={true}
                                >
                                    {attributes.photoURL ? '更换静态图片' : '选择静态图片'}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(media) => setAttributes({ videoURL: media.url })}
                            allowedTypes={['video']}
                            render={({open}) => (
                                <Button 
                                    onClick={open}
                                    isPrimary={true}
                                    style={{marginLeft: '10px'}}
                                >
                                    {attributes.videoURL ? '更换视频' : '选择视频'}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </div>
                
                <TextControl
                    label="宽度"
                    value={attributes.width}
                    onChange={(width) => setAttributes({width})}
                />
                
                <TextControl
                    label="高度"
                    value={attributes.height}
                    onChange={(height) => setAttributes({height})}
                />
                
                {attributes.photoURL && attributes.videoURL && (
                    <div className="live-photo-container" style={{width: attributes.width, height: attributes.height}}>
                        <div className="live-photo">
                            <img src={attributes.photoURL} alt="Live Photo" />
                        </div>
                    </div>
                )}
            </div>
        );
    },
    
    save: function() {
        return null; // 使用PHP端渲染
    }
}); 