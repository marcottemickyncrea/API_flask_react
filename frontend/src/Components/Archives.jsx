// Importing modules
import React, { useState, useEffect } from "react";

function Archives() {
    const [archives, setArchives] = useState([])

    const getArchives = async () => {
        try {
            const response = await fetch("/archives", {
                method:"GET"
            })
            const jsonData = await response.json()
 
            setArchives(jsonData)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getArchives()
    }, [])

    return (
        <div className="container-coms">
            <div>
                <div className="container-title">
                    <h2>Les commentaires testés</h2>
                    <p>Ici, retrouvez tous les commentaires testés, avec le ressenti de l'auteur du com et l'analyse par notre IA.</p>
                </div>

                <ul>
                    {archives.map(archive => (
                        <li key={archive.date}>
                            <div className="container-com">
                                <div className="container-date-pouce">
                                    <p>{archive.date}</p>
                                    <div className="container-pouce">
                                        <div className="avis-pouce">
                                            <p>Sentiment</p>
                                            {archive.sentiment ? <div className="resultat like"></div> : <div className="resultat dislike"></div>}
                                        </div>
                                        <div className="avis-pouce">
                                            <p>Avis IA</p>
                                            {archive.avis_IA ? <div className="resultat like"></div> : <div className="resultat dislike"></div>}
                                        </div>
                                    </div>
                                </div>
                                <p>{archive.commentaire}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Archives;