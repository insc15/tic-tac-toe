function Box({onClick, value, allowCLick, highlight = '', point = ''}) {
    
    return (
        <div className="basis-1/3 aspect-square p-1" onClick={onClick}>
            <div className={`bg-[#12161f] h-full rounded ${!allowCLick ? 'hover:bg-[#1c2230] cursor-pointer' : ''} flex items-center justify-center duration-75 ${highlight} ${point}`}>
                {
                    value === 'O' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 32 32" fill="none"> 
                            <circle cx="16" cy="16" r="12" stroke="#2475C5" strokeWidth="4"/>
                        </svg>
                    : value === 'X' &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 32 32" fill="none">
                            <rect x="25.9779" y="3" width="4" height="32.4957" transform="rotate(45 25.9779 3)" fill="#E45651"/>
                            <rect width="4" height="32.4957" transform="matrix(-0.707107 0.707107 0.707107 0.707107 6.32751 3)" fill="#E45651"/>
                        </svg>
                }
            </div>
        </div>
    );
}

export default Box;