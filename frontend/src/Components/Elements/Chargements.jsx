import "./chargement.css";

function Chargement({ phrase }) {
    return (
        <div className="container">
            <p>{phrase}</p>
            <div className="container-loader">
                <div className="loader"></div>
            </div>
        </div>
    )
}

export default Chargement