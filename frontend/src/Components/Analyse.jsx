import React, { useState, useEffect } from "react";
import Chargement from "./Elements/Chargements";

function Analyse( {setLike}) {
    const [commentaire, setCommentaire] = useState("");
    const [sentiment, setSentiment] = useState("");
    const [bool, setBool] = useState(false);
    const [isLoading, setIsloading] = useState(false)

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            setIsloading(true)
            const body = { commentaire };
            let response = await fetch('/analyse', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json()
            setBool(true)
            setCommentaire(parseRes)
            setIsloading(false)
            setLike(parseRes[0].like)
            
        } catch (e) {
            console.log(e.message)
        }
    }

    const onSubmitForm2 = async e => {
        e.preventDefault();
        setLike("")
        let id = commentaire[0].id
        try {
            const body = { sentiment, id };
            let response = await fetch('/analyse/sentiment', {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            });
            setBool(false)
            setCommentaire("")
        } catch (e) {
            console.log(e.message)
        }
    }

    if (isLoading) {
        return (
            <div className="container-animation">
                <Chargement phrase={"J'analyse votre commentaire."} />
            </div>
        )
    }

    return (
        <div className="container-textarea " >
            {
                bool ? (
                    <div className="response-IA">
                        <div className="container-response">
                            <div className="guillemet">"</div>
                            <p className="commentaire">{commentaire[0].commentaire}</p>
                            <div className="guillemet">"</div>
                        </div>
                        <div>
                            <p>{commentaire[0].proba}</p>
                        </div>
                        <div>
                            <div className={Boolean(commentaire[0].like) ? "response like" : "response dislike"}></div>
                        </div>
                        <form onSubmit={onSubmitForm2}>
                            <fieldset>
                                <legend>Ton commentaire était...</legend>
                                <div>
                                    <input
                                        type="radio"
                                        id="positif"
                                        name="sentiment"
                                        value="1"
                                        onChange={e => setSentiment(e.target.value)} />
                                    <label for="positif">positif</label>
                                </div>

                                <div>
                                    <input
                                        type="radio"
                                        id="negatif"
                                        name="sentiment"
                                        value="0"
                                        onChange={e => setSentiment(e.target.value)} />
                                    <label for="negatif">négatif</label>
                                </div>
                            </fieldset>
                            <input type="submit" value='Tester un autre commentaire' />
                        </form>
                    </div>
                ) : (
                    <div className="textarea">
                        <div className="container-form">
                            <form onSubmit={onSubmitForm}>
                                <label for="commentaire">
                                    <textarea
                                        name="commentaire"
                                        id="commentaire"
                                        value={commentaire}
                                        onChange={e => setCommentaire(e.target.value)}
                                        placeholder="Je suis une IA qui analyse ton commentaire et détermine si c'est un avis positif ou négatif !">
                                    </textarea>
                                </label>
                                <input type="submit" value="Tester mon commentaire" />
                            </form>
                            <div className="container-avis">
                                <div className="avis like"></div>
                                <div className="avis dislike"></div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Analyse;