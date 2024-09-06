import React, {useState} from 'react'
import {useForm} from 'react-hook-form'


function SearchRepositoryPage() {

    return ( 
    <div className = "bg-zinc-800 p-10 rounded-md flex justify-center flex-col m-auto h-screen">
          
      <h1 className="text-white my-2 w-full font-bold text-6xl">Search Repositories</h1>

      <label class="inset text-black text-5xl">		
				<input class="w-full placeholder:italic placeholder:text-black placeholder:text-slate-400 block bg-white text-black border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm inline" 
          placeholder="Search for a repository..." type="text" name="search"/>
        <button class="text-2xl inline bg-white px-4 py-2 rounded-md my-2"> Search </button>
			</label>      


        </div>
    )
}

export default SearchRepositoryPage
