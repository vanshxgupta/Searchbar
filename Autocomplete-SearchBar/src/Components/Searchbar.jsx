import React, { useEffect, useState } from 'react';

const Searchbar = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [cache,setcache]=useState({});


    //caching so that we do not have to make the api call again and again for the the same input

    const handleInputChange = (inputValue) => {
        setInput(inputValue);
        setShowResults(false);
    };

    const fetchData = async () => {

        
        if (input.trim() === "") {
            setResults([]);
            return;
        }
        
        if(cache[input]){
            console.log("cache returned",input);
            setResults(cache[input]);
            return;
        }

        try {
            console.log("API CALL",input)
            const response = await fetch(`https://dummyjson.com/products/search?q=${input}`);
            const jsonData = await response.json();
            setResults(jsonData?.products);

            //cache stores like this mango:[there search result array],,[mango] is the input , and its array is the setresults array
            setcache(prev=>({...prev,[input]:jsonData?.products}));

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    //using debouncing to improve the and optimisation , because on every input change the api call is been made, to stop it , we are using deboucing so that , api call is only made when we stop typing or a like 0.3ms or something like that , which is better than calling api call , even when we don't want 

    useEffect(() => {
        const timer=setTimeout(fetchData,500);

        //this return is called only when the component is unmounting
        //never forgot to write the return statement when u are writing debouncing 
        return ()=>{
            clearTimeout(timer);
        }
        
    }, [input]);

    return (
        <div className="min-h-screen bg-slate-800 flex flex-col items-center p-6">
            <h1 className="text-center font-bold text-7xl text-white mb-6">SearchBar</h1>
            <div className="relative w-96">
                <input
                    type="text"
                    className="bg-amber-50 h-12 w-full px-4 text-lg border-2 border-red-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setShowResults(false)}
                />
                {showResults && results.length > 0 && (
                    <div className="absolute top-14 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <ul>
                            {results.map((r) => (
                                <li
                                    className="h-10 text-sm hover:bg-amber-100 cursor-pointer px-2 flex items-center"
                                    onMouseDown={() => handleInputChange(r.title)} // Change from onClick to onMouseDown , as onclick , not changing the input field becuase of the onblur event 
                                    key={r.id}
                                >
                                    {r.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Searchbar;
