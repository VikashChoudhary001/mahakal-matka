import React, { useEffect, useState } from "react";
import { getNotifications } from "../repository/NotificaitionRepository";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { setAppData } from "../store/features/appData/appDataSlice";

// Function to convert URLs in text to clickable links while preserving line breaks
const linkifyText = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all font-semibold text-blue-600 hover:text-blue-800"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    // Split by newlines and map to preserve line breaks
    const lines = part.split('\n');
    return lines.map((line, lineIndex) => (
      <React.Fragment key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < lines.length - 1 && '\n'}
      </React.Fragment>
    ));
  });
};

const Notifications = () => {
  let [notifications, setNotifications] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  let [loading, setLoading] = useState(false);
  let { appData } = useSelector((state) => state.appData);
  let innerAppData = appData.appData;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        let { data } = await getNotifications({
          page: currentPage,
        });
        if (data.error) {
          toast.error(data.message);
        } else {
          setNotifications(data?.response?.notifications?.data);
          setTotalPages(data?.response?.notifications?.last_page);
          localStorage.setItem(
            "readNotifications",
            innerAppData.notification_count
          );
        }
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentPage]);

  return (
    <div className="flex flex-col pb-8">
      <div className="p-3 pb-0">
        <div className="flex flex-col w-full gap-1">
          {loading ? (
            <div className="flex justify-center">
              <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                <svg
                  className="text-black/45 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  ></path>
                </svg>
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-2 bg-white border rounded-lg shadow-md border-black/15"
              >
                <span className="text-sm font-semibold uppercase text-orange">
                  {notification.title}
                </span>
                <p className="text-sm mt-1 whitespace-pre-line" style={{ wordBreak: 'normal', overflowWrap: 'anywhere', hyphens: 'none' }}>
                  {linkifyText(notification.description)}
                </p>
                <p className="text-xs mt-2 font-semibold text-right">

                  {moment(notification.created_at).format(
                    "DD-MM-YYYY hh:mm:ss A"
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      {!loading && (
        <Pagination
          lastPage={totalPages}
          currentPage={currentPage}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Notifications;
