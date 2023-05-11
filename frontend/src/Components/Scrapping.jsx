// Importing modules
import React, { useState, useEffect } from "react";
import Chargement from "./Elements/Chargements";


function Scrapping() {
    const [numFilm, setNumFilm] = useState()
    const [commentaires, setCommentaires] = useState([]);
    const [bool, setBool] = useState(false)
    const [isLoading, setIsloading] = useState(false)


    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            setIsloading(true)
            const body = { numFilm };
            let response = await fetch('/scrapping/commentaires', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json()
            setBool(true)
            setCommentaires(parseRes)
            setIsloading(false)
        } catch (e) {
            console.log(e.message)
        }
    }

    if (isLoading) {
        return (
            <div className="container-animation">
                <Chargement phrase={"Patientez, je scrappe ..."} />
            </div>
        )
    }

    return (
        <div className="container-coms">
            {bool ? (
                <div>
                    <div className="container-title">
                        <h2>Les commentaires scrapés</h2>
                        <p>Ici, retrouvez tous les commentaires scrapés pour le film "{commentaires.titre}", avec le sentiment de l'auteur et l'analyse par notre IA.</p>
                    </div>
                    <ul>
                        {commentaires.commentaires.map(commentaire => (
                            <li>
                                <div className="container-com">
                                    <div className="container-pouce">
                                        <div className="avis-pouce">
                                            <p>Avis allociné</p>
                                            {commentaire.note > 3.0 ? <div className="resultat like"></div> : <div className="resultat dislike"></div>}
                                        </div>
                                        <div className="avis-pouce">
                                            <p>Avis IA</p>
                                            {commentaire.avis_AI ? <div className="resultat like"></div> : <div className="resultat dislike"></div>}
                                        </div>
                                    </div>
                                    <p>{commentaire.commentaire}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="container-input">
                    <form onSubmit={onSubmitForm}>
                        <label for="numero-film">Le numéro que vous souhaitez scrapper:</label>
                        <input
                            type="number"
                            id="numero-film"
                            name="numero-film"
                            value={numFilm}
                            onChange={e => setNumFilm(e.target.value)}
                        />
                        <input type="submit" value="Valider le film" />
                    </form>
                </div>
            )}
        </div>
    );
}

export default Scrapping;