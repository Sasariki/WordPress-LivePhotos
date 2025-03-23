document.addEventListener('DOMContentLoaded', function() {
    const livePhotos = document.querySelectorAll('.live-photo');
    
    livePhotos.forEach(photo => {
        const video = photo.querySelector('video');
        
        // 鼠标进入时播放视频
        photo.addEventListener('mouseenter', () => {
            photo.classList.add('playing');
            video.currentTime = 0;
            video.play();
        });
        
        // 鼠标离开时停止播放
        photo.addEventListener('mouseleave', () => {
            photo.classList.remove('playing');
            video.pause();
        });
        
        // 触摸设备支持
        photo.addEventListener('touchstart', () => {
            photo.classList.add('playing');
            video.currentTime = 0;
            video.play();
        });
        
        photo.addEventListener('touchend', () => {
            photo.classList.remove('playing');
            video.pause();
        });
        
        // 视频播放结束时
        video.addEventListener('ended', () => {
            photo.classList.remove('playing');
        });
    });
}); 