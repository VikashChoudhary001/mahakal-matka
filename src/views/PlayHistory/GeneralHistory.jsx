import React, { useEffect, useState } from "react";
import { getKalyanGameHistory } from "../../repository/HistoryRepository";
import { toast } from "react-toastify";
import { getMarkets } from "../../repository/MarketRepository";
import { deleteSinglePlay } from "../../repository/GameRepository";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";

const GeneralHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [marketId, setMarketId] = useState("");
    const [lastPage, setLastPage] = useState(1);
    const [date, setDate] = useState("");
    const [dataLoading, setDataLoading] = useState(false);
    const [perPageRecords, setPerPageRecords] = useState(10);
    const [deleteIdxArr, setDeleteIdxArr] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [gameType, setGameType] = useState("all");
    const [session, setSession] = useState("all");
    const [status, setStatus] = useState("ALL");
    const [markets, setMarkets] = useState([]);

    const fetchCurrentHistory = async () => {
        try {
            setDataLoading(true);
            const data = await getKalyanGameHistory({
                page: currentPage,
                date,
                marketId,
                type: "general",
                session,
                status,
                gameTypeId: gameType,
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

    function titleCase(str) {
        return str.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase());
    }

    useEffect(() => {
        const fetchMarkets = async () => {
            const { data } = await getMarkets("general");
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
                    <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {/* Market (Game) Filter */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[14px]">Game</label>
                            <select
                                value={marketId}
                                name="marketId"
                                onChange={(e) => setMarketId(e.target.value)}
                                className="h-8 px-2 py-1 text-black border-0 rounded"
                            >
                                <option value="">Game</option>
                                {markets
                                    ?.filter((market) => market != null)
                                    .map((market) => (
                                        <option key={market.id} value={market.id}>
                                            {market.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Game Type Filter */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[14px]">Game Type</label>
                            <select
                                value={gameType}
                                name="gameType"
                                onChange={(e) => setGameType(e.target.value)}
                                className="h-8 px-2 py-1 text-black border-0 rounded"
                            >
                                <option value="all">All</option>
                                <option value="4">Single Ank</option>
                                <option value="5">Jodi</option>
                                <option value="6">Single Pana</option>
                                <option value="7">Double Pana</option>
                                <option value="8">Triple Pana</option>
                                <option value="9">Half Sangam A</option>
                                <option value="10">Half Sangam B</option>
                                <option value="11">Full Sangam</option>
                            </select>
                        </div>

                        {/* Session Filter */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[14px]">Session</label>
                            <select
                                value={session}
                                name="session"
                                onChange={(e) => setSession(e.target.value)}
                                className="h-8 px-2 py-1 text-black border-0 rounded"
                            >
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="close">Close</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[14px]">Status</label>
                            <select
                                value={status}
                                name="status"
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-8 px-2 py-1 text-black border-0 rounded"
                            >
                                <option value="0">All</option>
                                <option value="1">Win</option>
                                <option value="2">Lose</option>
                                <option value="3">Pending</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[14px]">Date</label>
                            <input
                                className="h-8 px-2 py-1 text-black border-0 rounded"
                                type="date"
                                value={date}
                                name="date"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex flex-col">
                            <button className="h-8 px-2 py-1 text-white border-0 bg-[#640138] rounded mt-[21px] shadow-lg">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* History Table */}
            <div className="w-full overflow-auto">
                <table className="w-full text-xs table-auto">
                    <thead className="bg-greenLight">
                        <tr>
                            <th className="p-0.5">S.No</th>
                            <th className="p-0.5">Date</th>
                            <th className="p-0.5">Market Name</th>
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
                                    key={dataItemIdx}
                                    id={`Row${dataItem?.gameId}`}
                                    className="text-center"
                                >
                                    <td className="p-1">
                                        {dataItem.id}
                                    </td>
                                    <td className="p-1">{dataItem?.date}</td>
                                    <td className="p-1">
                                        <p>{dataItem?.market?.name}</p>
                                        <p
                                            className={`${dataItem?.session?.toLowerCase() === 'open'
                                                ? "text-green-500"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {dataItem?.session == "null" ? '' : `(${titleCase(dataItem?.session)})`}
                                        </p>
                                    </td>
                                    <td className="p-1">{dataItem?.game_type?.name}</td>
                                    <td className="p-1">{dataItem?.number}</td>
                                    <td className="p-1">{dataItem?.amount}</td>
                                    <td className="p-1">{[null, 'null'].includes(dataItem?.win_amount) ? dataItem?.status?.toLowerCase() === 'pending' ? 'Waiting for result' : '' : dataItem?.win_amount}</td>
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

            {/* Pagination and Loading Spinner */}
            {dataLoading && (
                <div className="flex justify-center w-full p-4">
                    <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                        <svg
                            className="text-gray-300 animate-spin"
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
                                className="text-gray-600"
                            ></path>
                        </svg>
                    </div>
                </div>
            )}
            {!dataLoading && historyData.length === 0 && (
                <div className="w-full p-2 font-semibold text-center">No Data Found</div>
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

export default GeneralHistory;
