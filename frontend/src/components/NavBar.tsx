import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../logo.png"

function NavBar() {
    return (
      <div className="navbar bg-black relative z-50">
      <div className="px-4 navbar-start">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={logo} alt="#_"></img>
        </div>
      </label>
        <a href="/" className="btn btn-ghost normal-cas text-white text-xl">lasso</a>
        <ul className="menu menu-horizontal p-0">
          <li><a href="/dustsweeper"className="text-bold text-white hover:bg-green-300 hover:text-black">Dust Sweeper</a></li>
          <li><a href="/exchange" className="text-bold text-white hover:bg-green-300 hover:text-black">Exchange</a></li>
          <li><a href="/marketplace" className="text-bold text-white hover:bg-green-300 hover:text-black">Marketplace</a></li>
        </ul>
      </div>
      <div className="navbar-end py-4 px-4">
      <ConnectButton></ConnectButton>
      </div>
      </div>
      );
  }
  
  export default NavBar;