const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const courseFallbacks = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

export const homepageImages = {
    hero: 'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?auto=format&fit=crop&w=1600&q=80',
    highlight: 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?auto=format&fit=crop&w=1600&q=80',
    auth: 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?auto=format&fit=crop&w=1400&q=80',
    secondary: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    tertiary: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80'
};

export const getAssetUrl = (path) => {
    if (!path) {
        return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return `${API_BASE_URL}${path}`;
};

export const getCourseImage = (course, index = 0) => {
    if (course?.thumbnail) {
        return getAssetUrl(course.thumbnail);
    }

    return courseFallbacks[index % courseFallbacks.length];
};
