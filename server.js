const express = require("express");
const axios = require("axios");

const app = express();
const port = 9999;

const accessToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjYyMTQwLCJpYXQiOjE3MTgyNjE4NDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI5MjZkYTY1LTEyODEtNDc2OS1iMTI5LWU4OTc4ZTIwMzVkZCIsInN1YiI6IjIxMDAwMzAwNTFjc2VoQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IktMIFVOSVZFUlNJVFkiLCJjbGllbnRJRCI6ImI5MjZkYTY1LTEyODEtNDc2OS1iMTI5LWU4OTc4ZTIwMzVkZCIsImNsaWVudFNlY3JldCI6IktZbWVwR1ZMYVpXTFl1SFEiLCJvd25lck5hbWUiOiJTUklOQURIIEJFSkFXQURBIiwib3duZXJFbWFpbCI6IjIxMDAwMzAwNTFjc2VoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzAwNTEifQ.KEZ3gPYoVi31HWGlqRw6p7rFTLIdnN4m0gw0JQpmsSA";

let windowState = [];
const windowSize = 10;

async function fetchNumbers(type) {
    try {
        let url;
        switch (type) {
            case "p":
                url = "http://20.244.56.144/test/primes";
                break;
            case "f":
                url = "http://20.244.56.144/test/fibo";
                break;
            case "e":
                url = "http://20.244.56.144/test/even";
                break;
            case "r":
                url = "http://20.244.56.144/test/rand";
                break;
            default:
                throw new Error("Invalid type");
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: accessToken,
            },
            timeout: 500,
        });
        return response.data.numbers;
    } catch (error) {
        console.error("Error fetching numbers:", error);
        return [];
    }
}

function updateWindow(newNumbers) {
    const prevState = [...windowState];
    windowState = [...new Set([...windowState, ...newNumbers])];
    if (windowState.length > windowSize) {
        windowState = windowState.slice(-windowSize);
    }
    return prevState;
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

app.get("/numbers/:type", async (req, res) => {
    const { type } = req.params;

    if (!["p", "f", "e", "r"].includes(type)) {
        return res.status(400).json({ error: "Invalid type parameter" });
    }

    const newNumbers = await fetchNumbers(type);
    console.log(newNumbers);
    const prevState = updateWindow(newNumbers);
    const currState = [...windowState];
    const avg = calculateAverage(currState);

    res.json({
        numbers: newNumbers,
        windowPrevState: prevState,
        windowCurrState: currState,
        avg: avg.toFixed(2),
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
