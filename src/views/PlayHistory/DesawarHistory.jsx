import React, { useEffect, useState } from "react";
import { getGameHistory } from "../../repository/HistoryRepository";
import { toast } from "react-toastify";
import { getMarkets } from "../../repository/MarketRepository";
import { deleteSinglePlay } from "../../repository/GameRepository";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import NoDataFoundImage from "../../assets/imgs/noDataFound.png";

const DesawarHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [marketId, setMarketId] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [date, setDate] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [perPageRecords, setPerPageRecords] = useState(10);
  const [deleteIdxArr, setDeleteIdxArr] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const fetchCurrentHistory = async () => {
    try {
      setDataLoading(true);
      const data = await getGameHistory({
        page: currentPage,
        date,
        marketId,
        type: "desawar",
      });

      if (data.data.error === false) {
        setHistoryData(data.data.response.gameHistory.data);
        setLastPage(data.data.response.gameHistory.last_page);
        setPerPageRecords(data.data.response.gameHistory.per_page);
      } else {
        toast.error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentHistory();
  }, [currentPage]);

  useEffect(() => {
    const fetchMarkets = async () => {
      let { data } = await getMarkets("desawar");
      if (data.error === false) {
        setMarkets(data.response.markets);
      } else {
        toast.error(data.message);
      }
    };
    fetchMarkets();
  }, []);

  return (
    <>
      <div className="flex p-3 text-white bg-primary">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentPage === 1) fetchCurrentHistory();
            else setCurrentPage(1);
          }}
          className="flex items-end w-full gap-4"
        >
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold">Date</label>
              <input
                className="h-10 px-2 py-1 mt-1 text-black border-0 rounded"
                type="date"
                value={date}
                name="date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Market</label>
              <select
                value={marketId}
                name="marketId"
                onChange={(e) => setMarketId(e.target.value)}
                className="h-10 px-2 py-1 mt-1 text-black border-0 rounded"
              >
                <option value="">Select Market</option>
                {markets
                  ?.filter((market) => market != null)
                  .map((market) => (
                    <option key={market.id} value={market.id}>
                      {market.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button type="submit" className="flex-shrink-0 text-orange">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </form>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">S.No</th>
              <th className="p-0.5">Date</th>
              <th className="p-0.5">Name</th>
              <th className="p-0.5">Type</th>
              <th className="p-0.5">Number</th>
              <th className="p-0.5">Balance</th>
              <th className="p-0.5">Winning</th>
              <th className="p-0.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!dataLoading &&
              historyData.map((dataItem, dataItemIdx) => (
                <tr
                  key={dataItem?.gameId}
                  id={`Row${dataItem?.gameId}`}
                  className="text-center"
                >
                  <td className="p-1">
                    {dataItemIdx + 1 + (currentPage - 1) * perPageRecords}
                  </td>
                  <td className="p-1">{dataItem?.date}</td>
                  <td className="p-1">{dataItem?.market?.name}</td>
                  <td className="p-1">{dataItem?.game_type?.name}</td>
                  <td className="p-1">{dataItem?.number}</td>
                  <td className="p-1">{dataItem?.amount}</td>
                  <td className="p-1">{dataItem?.win_amount}</td>
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setDeleteIdxArr((prevState) => [
                            ...prevState,
                            dataItem?.id,
                          ]);
                          let { data } = await deleteSinglePlay({
                            gameId: dataItem?.id,
                          });
                          if (data.error) {
                            toast.error(data.message);
                          } else {
                            toast.success(data.message);
                            let rowId = `Row${dataItem?.gameId}`;
                            document.getElementById(rowId).remove();
                          }
                        } catch (err) {
                          toast.error(err.message);
                        } finally {
                          setDeleteIdxArr((prevState) => [
                            ...prevState.filter((ps) => ps !== dataItem?.id),
                          ]);
                        }
                      }}
                      className="px-3 py-1 text-[9px] w-16 h-7 font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md"
                    >
                      {deleteIdxArr.includes(dataItem?.id) ? (
                        <Spinner size={15} />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {dataLoading && (
        <div className="flex justify-center w-full p-4">
          <Spinner />
        </div>
      )}
      {!dataLoading && historyData.length === 0 && (
        <div className="w-full flex py-4 flex-col items-center gap-2">
          <img src={NoDataFoundImage} width={100} alt="" />
          <p className="text-gray-400 font-bold text-sm">No Data Found</p>

        </div>
      )}
      {!dataLoading && historyData.length > 0 && (
        <div className="pb-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default DesawarHistory;
