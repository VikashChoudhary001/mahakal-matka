import React, { useContext } from 'react';
import Modal from './Modal';
import DownloadButton from './DownloadButton';
import { useSelector } from 'react-redux';
import { DeferredPromptContext } from '../context/DeferredPromptContext';

const InstallAppDialog = ({ isOpen, onClose }) => {
    const { appData } = useSelector((state) => state.appData.appData);
    const { deferredPrompt } = useContext(DeferredPromptContext);

    // Detect Android WebView via the JS bridge your WebView exposes
    const isInAndroidApp =
        typeof window !== 'undefined' && typeof window.AndroidApp !== 'undefined';

    const handleDownloadComplete = () => {
        // Mark that user has interacted with dialog - don't show dialog again
        localStorage.setItem("userDismissedInstallDialog", "true");

        // Close dialog after successful download
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    const handleClose = () => {
        // Mark that user has dismissed dialog - don't show dialog again
        localStorage.setItem("userDismissedInstallDialog", "true");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen && !isInAndroidApp}
            toggle={onClose}
            className="custom-modal"
            centered
        >
            <div className="font-semibold text-white bg-primary rounded-lg" style={{ width: "400px", maxWidth: "90vw" }}>
                <div className="flex justify-between p-3 border-b border-white">
                    <h4>📱 Install Our App</h4>
                    <button onClick={handleClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-center gap-4 p-6">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🚀</div>
                        <h3 className="text-xl mb-2">Get Better Experience!</h3>
                        <p className="text-sm opacity-90 mb-4">
                            Install our app for faster access, better performance, and exclusive features.
                        </p>
                    </div>

                    {appData?.app_update_link?.length > 0 || deferredPrompt ? (
                        <div className="w-full">
                            <DownloadButton
                                variant="sidebar"
                                size="large"
                                onDownloadComplete={handleDownloadComplete}
                            />
                        </div>
                    ) : (
                        <div className="text-center text-sm opacity-75">
                            App installation not available at the moment.
                        </div>
                    )}

                    <div className="text-xs text-center opacity-75 mt-2">
                        ✨ Fast • Secure • Easy to use
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default InstallAppDialog;
