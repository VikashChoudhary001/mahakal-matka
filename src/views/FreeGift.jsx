import React, { useEffect } from "react";

const FreeGift = () => {
    useEffect(() => {
        document.title = "Get Free Bonus | Mahakal Matka"
    }, [])
    return (
        <div className="pb-8">
            <iframe className="w-full h-[100vh]" src="https://api.mahakalmatka.com/free-gift" />
        </div>
    );
};

export default FreeGift;

