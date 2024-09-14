export function Dropdown({buttonText, action, isActive, options}){
    return (
        <div class="relative top-[120px]">
            <button onClick={action}
            className="inline-flex px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
            >
                {buttonText}
                <svg
                className={`w-5 h-5 ml-2 transform ${isActive ? "rotate-180" : "rotate-0"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isActive && (
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                {options.map((option, index) => (
                    <li key={index}>
                    <a
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => option.onClick && option.onClick()}
                    >
                        {option.label}
                    </a>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

export function FileBrowser({action, label}){
    return (
        <form class="flex items-center space-x-6">
            <div class="shrink-0">
                <img class="h-16 w-16 object-cover rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Current profile photo" />
            </div>
            <label class="block">
                <span class="sr-only">{label}</span>
                <input type="file" onChange={e => action(e.target.files)}
                class="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
                "/>
            </label>
        </form>
    )
}