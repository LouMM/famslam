import { useState } from 'react';

export const useFetchImagesFromPage = () => {
    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState<string>('');

    const fetchImages = async (pageUrl: string) => {
        const response = await fetch(pageUrl);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        // Extract title
        const pageTitle = doc.querySelector('title')?.innerText || '';
        setTitle(pageTitle);

        // Extract images and sort by size
        const imgElements = Array.from(doc.querySelectorAll('img'));
        const imagesWithSizes = await Promise.all(
            imgElements.map(async img => {
                const src = img.src;
                if (!src) return null;
                const res = await fetch(src, { method: 'HEAD' }).catch(() => null);
                if (!res) return null;
                const size = Number(res.headers.get('content-length')) || 0;
                return { src, size };
            })
        );
        const filtered = imagesWithSizes.filter(Boolean) as { src: string; size: number }[];
        filtered.sort((a, b) => b.size - a.size);

        // Take up to 5 largest
        setImages(filtered.slice(0, 5).map(i => i.src));
    };

    return { images, title, fetchImages };
};
