import { Link } from "react-router-dom"
import { VscListFlat } from 'react-icons/vsc'
import { useState } from "react";

function Header() {

    const [headerClass, setHeaderClass] = useState("default");

    function handleHeader() {
        if (headerClass === "default") {
            setHeaderClass("responsive");
        } else {
            setHeaderClass("default");
        }
    }

    return (
        <my-header>
            <div className={headerClass}>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/send'>Send</Link>
                <Link to='/blocks'>Blocks</Link>
                <Link to='/unconfirmed-tx'>Mempool</Link>
                <Link to='/miner'>MINERS</Link>
                <a className="icon" onClick={() => handleHeader()} >
                    <VscListFlat />
                </a>
            </div>
        </my-header>
    )
}
export default Header