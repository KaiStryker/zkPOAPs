import './App.css';

function App() {
  return (
    <div className="App">
    <section className="relative w-full h-full bg-black" data-tails-scripts="//unpkg.com/alpinejs">
        <div className="relative z-40 h-full px-10 mx-auto max-w-7xl">
            <nav className="relative z-40 flex items-center justify-between h-24 mx-auto md:px-0 lg:px-10 max-w-7xl">
                <div className="relative z-20 flex items-center justify-between w-full md:w-auto">
                    <div>
                        <a href="#_" className="text-lg font-semibold text-white md:text-xl">
                            </a><a href="#_" className="flex items-center font-bold text-white lg:w-auto title-font lg:items-center lg:justify-center md:mb-0">
                                <span className="text-xl leading-none select-none">zkPOAPs<span className="text-yellow-300">.</span></span>
                            </a>
                    </div>

                    <div className="flex md:hidden">
                        <button type="button" className="text-gray-200 hover:text-gray-100 focus:outline-none focus:text-gray-100" aria-label="toggle menu">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                            <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z">
                            </path>
                        </svg>
                        </button>
                    </div>
                </div>

                <div className="absolute z-20 flex-col justify-center hidden pr-5 mt-4 space-y-8 md:flex md:relative md:pr-3 lg:pr-0 md:flex-row md:space-y-0 md:items-center md:space-x-6 md:mt-0">
                    <a className="flex-shrink-0 font-semibold text-gray-200 hover:underline" href="#_">Learn More Here</a>
                    <a href="#_" className="flex-shrink-0 w-auto text-base font-semibold leading-5 text-left text-gray-200 capitalize bg-transparent rounded-lg md:text-sm md:py-3 md:px-6 md:font-medium md:text-center md:text-white md:bg-gray-900 md:mx-0">
                        Sign Up
                    </a>
                </div>
            </nav>

            <div className="flex flex-col items-center justify-center w-full h-full py-32 -mt-20 sm:py-48 md:py-64"> 
                <h1 className="mb-20 text-5xl font-extrabold leading-tight text-left text-white sm:text-center lg:text-7xl lg:leading-tight">Anonymously claim POAPs<br></br><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500">Privately verify Attendance.</span></h1>
                <a href="/mint" className="mt-10 relative w-full group sm:w-auto">
                    <span className="absolute top-0 left-0 w-full h-full text-transparent border-2 border-white rounded">Join Today</span>
                    <span className="px-8 inline-block bg-gradient-to-br sm:w-auto w-full text-center from-green-500 font-semibold via-green-500 to-green-500 relative transition-all ease-linear duration-150 transform group-hover:-translate-y-1.5 group-hover:translate-x-1.5 -translate-y-2.5 text-lg rounded translate-x-2 py-4">Explore zkPOAPs Today!</span>
                </a>
                <p className="flex items-center mt-4 text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Free to Try. Join the zk revolution today.</span>
                </p>
            </div>
        </div>
        <img alt="#_" className="bottom-0 left-0 object-cover w-full" src="http://devdojo.com.s3.us-east-1.amazonaws.com/tails/images/mesh-bg.svg"></img>
        <div className="bottom-0 left-0 z-30 w-full h-full bg-cover"></div>
    </section>
    </div>
  );
}

export default App;