import React, { useContext } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useDownload } from '../hooks/useDownload';
import { useSelector } from 'react-redux';
import { ShowEveryThing } from '../credentials';
import { DeferredPromptContext } from '../context/DeferredPromptContext';

const DownloadButton = ({
    variant = 'default',
    className = '',
    onDownloadComplete = null,
    showText = true,
    size = 'medium'
}) => {
    const { appData } = useSelector((state) => state.appData.appData);
    const { downloadProgress, isDownloading, downloadError, downloadFile } = useDownload();
    const { deferredPrompt, setDeferredPrompt } = useContext(DeferredPromptContext);

    const handleDownloadClick = async () => {
        if (appData?.app_update_link?.length > 0) {
            const downloadUrl = ShowEveryThing ? "https://api.mahakalmatka.com/download2" : appData?.app_update_link;
            const result = await downloadFile(downloadUrl, 'MahakalMatka.apk');

            if (result.success && onDownloadComplete) {
                onDownloadComplete();
            }
        } else if (deferredPrompt) {
            // Handle PWA installation
            deferredPrompt?.prompt();
            const { outcome } = await deferredPrompt?.userChoice;
            if (outcome === "accepted") {
                console.log("User accepted the PWA install prompt");
                if (onDownloadComplete) {
                    onDownloadComplete();
                }
            } else {
                console.log("User dismissed the PWA install prompt");
            }
            setDeferredPrompt(null);
        }
    };

    // Size configurations
    const sizeConfig = {
        small: {
            padding: '4px 6px',
            gap: '6px',
            fontSize: '12px',
            iconSize: 'w-3 h-3'
        },
        medium: {
            padding: '5px 8px',
            gap: '10px',
            fontSize: '14px',
            iconSize: 'w-4 h-4'
        },
        large: {
            padding: '8px 12px',
            gap: '12px',
            fontSize: '16px',
            iconSize: 'w-5 h-5'
        }
    };

    const config = sizeConfig[size];

    // Variant styles
    const getVariantStyles = () => {
        const baseStyles = {
            display: "flex",
            alignItems: "center",
            gap: config.gap,
            padding: config.padding,
            borderRadius: "4px",
            fontWeight: "600",
            position: "relative",
            overflow: "hidden",
            cursor: isDownloading ? "not-allowed" : "pointer",
            opacity: isDownloading ? 0.8 : 1,
            fontSize: config.fontSize,
            border: "none",
            transition: "all 0.3s ease"
        };

        switch (variant) {
            case 'floating':
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #0098c7 ${downloadProgress}%, transparent ${downloadProgress}%)`
                            : "transparent",
                    border: downloadError ? "1px solid #ff4444" : "1px solid #0098c7",
                    color: downloadError ? "#fff" : "#0098c7",
                };
            case 'sidebar':
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #22c55e ${downloadProgress}%, rgba(34, 197, 94, 0.2) ${downloadProgress}%)`
                            : "#22c55e",
                    color: "#fff",
                    width: "100%",
                    justifyContent: "center",
                    borderRadius: "6px",
                };
            default:
                return {
                    ...baseStyles,
                    background: downloadError
                        ? "#ff4444"
                        : isDownloading
                            ? `linear-gradient(to right, #0098c7 ${downloadProgress}%, rgba(0, 152, 199, 0.2) ${downloadProgress}%)`
                            : "#0098c7",
                    color: "#fff",
                };
        }
    };

    const buttonText = () => {
        if (downloadError) return "Error";
        if (isDownloading) return `${downloadProgress}%`;
        if (appData?.app_update_link?.length > 0) {
            return "Download";
        } else if (deferredPrompt) {
            return "Install";
        }
        return "Download";
    };

    return (
        <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            style={getVariantStyles()}
            className={className}
        >
            <FaDownload className={config.iconSize} />
            {showText && buttonText()}
        </button>
    );
};

export default DownloadButton;
