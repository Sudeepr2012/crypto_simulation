import { Link } from "react-router-dom"

function Header() {
    return (
        <my-header>
            <div className="myHeader-div">
                <Link to='/dashboard'>Dashboard</Link>
            </div>
            <div className="myHeader-div">
                <Link to='/send'>Send</Link>
            </div>
            <div className="myHeader-div">
                <Link to='/blocks'>Blocks</Link>
            </div>
            <div className="myHeader-div">
                <Link to='/unconfirmed-tx'>Mempool</Link>
            </div>
            <div className="myHeader-div">
                <Link to='/miner'>MINERS</Link>
            </div>
        </my-header>
    )
}
export default Header