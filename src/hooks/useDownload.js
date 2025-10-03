import { useState } from 'react';

export const useDownload = () => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const downloadFile = async (url, filename) => {
        try {
            setIsDownloading(true);
            setDownloadProgress(0);
            setDownloadError(null);

            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const contentLength = response.headers.get('content-length');
            const total = parseInt(contentLength, 10);
            let loaded = 0;

            const reader = response.body.getReader();
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;

                if (total) {
                    const progress = Math.round((loaded / total) * 100);
                    setDownloadProgress(progress);
                }
            }

            // Create blob from chunks
            const blob = new Blob(chunks);
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create download link and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || 'app.apk';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(downloadUrl);

            // Set progress to 100% and show completion
            setDownloadProgress(100);

            // Reset states after successful download
            setTimeout(() => {
                setIsDownloading(false);
                setDownloadProgress(0);
            }, 1500);

            return { success: true };

        } catch (error) {
            console.error('Download failed:', error);

            let errorMessage = 'Download failed. Please try again.';

            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'Server configuration issue. Using direct download instead.';
            } else if (error.message.includes('Server error')) {
                errorMessage = `Server error: ${error.message}. Using direct download instead.`;
            }

            setDownloadError(errorMessage);
            setIsDownloading(false);
            setDownloadProgress(0);

            // Show error for 3 seconds, then fallback to direct download
            setTimeout(() => {
                setDownloadError(null);
                window.location.href = url;
            }, 3000);

            return { success: false, error: errorMessage };
        }
    };

    return {
        downloadProgress,
        isDownloading,
        downloadError,
        downloadFile
    };
};
