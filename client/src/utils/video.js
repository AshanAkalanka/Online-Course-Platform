const YOUTUBE_HOSTS = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be'
]);

const DIRECT_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

const getGoogleDriveEmbedUrl = (parsedUrl) => {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const fileIndex = pathParts.indexOf('d');

    if (fileIndex !== -1 && pathParts[fileIndex + 1]) {
        return `https://drive.google.com/file/d/${pathParts[fileIndex + 1]}/preview`;
    }

    const fileId = parsedUrl.searchParams.get('id');
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
};

const getDropboxVideoUrl = (parsedUrl) => {
    const directUrl = new URL(parsedUrl.toString());
    directUrl.searchParams.set('raw', '1');
    directUrl.searchParams.delete('dl');
    return directUrl.toString();
};

const getYoutubeEmbedUrl = (parsedUrl) => {
    if (parsedUrl.hostname === 'youtu.be') {
        const videoId = parsedUrl.pathname.replace('/', '');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.toString();
    }

    if (parsedUrl.pathname.startsWith('/shorts/')) {
        const videoId = parsedUrl.pathname.split('/').filter(Boolean)[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    const videoId = parsedUrl.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const getVimeoEmbedUrl = (parsedUrl) => {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const videoId = pathParts[pathParts.length - 1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
};

const getLoomEmbedUrl = (parsedUrl) => {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const shareIndex = pathParts.indexOf('share');
    const videoId = shareIndex !== -1 ? pathParts[shareIndex + 1] : pathParts[pathParts.length - 1];
    return videoId ? `https://www.loom.com/embed/${videoId}` : null;
};

const getDailymotionEmbedUrl = (parsedUrl) => {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    if (parsedUrl.hostname === 'dai.ly') {
        return pathParts[0] ? `https://www.dailymotion.com/embed/video/${pathParts[0]}` : null;
    }

    const videoIndex = pathParts.indexOf('video');
    return videoIndex !== -1 && pathParts[videoIndex + 1]
        ? `https://www.dailymotion.com/embed/video/${pathParts[videoIndex + 1]}`
        : null;
};

const isDirectVideoFile = (parsedUrl) => {
    const pathname = parsedUrl.pathname.toLowerCase();
    return DIRECT_VIDEO_EXTENSIONS.some((extension) => pathname.endsWith(extension));
};

export const getVideoSource = (rawUrl) => {
    if (!rawUrl) {
        return { type: 'invalid', src: null };
    }

    try {
        const parsedUrl = new URL(rawUrl);
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

        if (currentOrigin && parsedUrl.origin === currentOrigin) {
            return { type: 'invalid', src: null };
        }

        if (isDirectVideoFile(parsedUrl)) {
            return { type: 'video', src: parsedUrl.toString() };
        }

        if (YOUTUBE_HOSTS.has(parsedUrl.hostname)) {
            return { type: 'embed', src: getYoutubeEmbedUrl(parsedUrl) };
        }

        if (parsedUrl.hostname.includes('vimeo.com')) {
            return { type: 'embed', src: getVimeoEmbedUrl(parsedUrl) };
        }

        if (parsedUrl.hostname.includes('loom.com')) {
            return { type: 'embed', src: getLoomEmbedUrl(parsedUrl) };
        }

        if (parsedUrl.hostname.includes('drive.google.com')) {
            return { type: 'embed', src: getGoogleDriveEmbedUrl(parsedUrl) };
        }

        if (parsedUrl.hostname.includes('dropbox.com')) {
            return { type: 'video', src: getDropboxVideoUrl(parsedUrl) };
        }

        if (parsedUrl.hostname.includes('dailymotion.com') || parsedUrl.hostname === 'dai.ly') {
            return { type: 'embed', src: getDailymotionEmbedUrl(parsedUrl) };
        }

        return { type: 'link', src: parsedUrl.toString() };
    } catch {
        return { type: 'invalid', src: null };
    }
};
