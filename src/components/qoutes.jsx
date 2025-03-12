import React, { useState, useEffect } from "react";
import quotes from "inspirational-quotes";

const getShortQuote = () => {
    let quote;
    do {
        quote = quotes.getQuote();
    } while (quote.text.length > 100); 
    return quote;
};

const Quote = ({ textColor = "#FFFFFF" }) => {
    const [quote, setQuote] = useState(getShortQuote());

    useEffect(() => {
        const interval = setInterval(() => {
            setQuote(getShortQuote()); // Get a new short quote every 30 minutes
        }, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center">
            <div
                className="text-center text-sm italic mt-4 mx-4 w-fit bg-white/5 backdrop-blur-lg shadow-lg p-2 px-8 rounded-lg border border-white/20"
                style={{ color: textColor }}
            >
                "{quote.text}"
            </div>
        </div>
    );
};

export default Quote;
