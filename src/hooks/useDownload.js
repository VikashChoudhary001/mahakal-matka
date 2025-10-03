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

            console.log('Starting direct download...');

            // Show progress animation for better UX
            const progressInterval = setInterval(() => {
                setDownloadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 100);

            // Start direct download
            setTimeout(() => {
                clearInterval(progressInterval);
                setDownloadProgress(100);

                // Trigger direct download
                window.location.href = url;

                // Reset states after download
                setTimeout(() => {
                    setIsDownloading(false);
                    setDownloadProgress(0);
                }, 1000);
            }, 500);

            return { success: true };

        } catch (error) {
            console.error('Download failed:', error);

            setDownloadError('Download failed. Please try again.');
            setIsDownloading(false);
            setDownloadProgress(0);

            // Clear error after 3 seconds
            setTimeout(() => {
                setDownloadError(null);
            }, 3000);

            return { success: false, error: 'Download failed. Please try again.' };
        }
    };

    return {
        downloadProgress,
        isDownloading,
        downloadError,
        downloadFile
    };
};
