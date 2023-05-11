import mysql.connector as mysqlpy
from util import standardize_phrase, predict_com, web_scrapping, titre_film_allocine, enlever_espace_debut_fin
from flask import Flask, render_template, redirect, request, flash, jsonify


coms_db = {'user': 'root',
           'password': 'example',
           'host': 'localhost',
           'port': '3308',
           'database': 'com_testés'}
  
app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
  
#adresse tuto: https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/ 

@app.route('/analyse', methods=['POST'])
def analyse():
    if request.method == 'POST':
        data = request.get_json()
        commentaire = data['commentaire']

        bool = ''
        proba = ''

        if len(commentaire) == 0:
            flash('Votre commentaire est trop court !!')
        else:
            standard = standardize_phrase(commentaire)
            predict = predict_com(standard)

            if predict[0][0] == 0:
                bool = False
            elif predict[0][0] == 1:
                bool = True

            if predict[1][0][0] > predict[1][0][1]:
                proba = f'''Je suis sûr à {round(predict[1][0][0] * 100, 2)} que le commentaire est négatif !'''
            elif predict[1][0][1] > predict[1][0][0]:
                proba = f'''Je suis sûr à {round(predict[1][0][1] * 100, 2)} que le commentaire est positif !'''

            bdd = mysqlpy.connect(user=coms_db["user"], password=coms_db["password"],
                                  host=coms_db["host"], port=coms_db["port"], database=coms_db["database"])
       
            cursor = bdd.cursor()
            cursor.execute(
                f'''INSERT INTO commentaires (commentaire, avis_model_IA)
                VALUES("{enlever_espace_debut_fin(commentaire.replace('"', ""))}", "{float(predict[0])}");''')
            bdd.commit()

            cursor.execute(f'''SELECT id FROM commentaires WHERE commentaire = "{enlever_espace_debut_fin(commentaire.replace('"', ''))}";''')
            id = cursor.fetchone()

            cursor.close()
            bdd.close()
   
            response = [{
                'commentaire': commentaire.replace('"', ""),
                'like': bool,
                'proba': proba,
                'id': id[0]
            }]

        return jsonify(response)

@app.route('/analyse/sentiment', methods=['PUT'])
def upgrade():
    if request.method == 'PUT':
            data = request.get_json()
            sentiment = data['sentiment']
            id = data['id']
           
            bdd = mysqlpy.connect(user=coms_db["user"], password=coms_db["password"],
                                  host=coms_db["host"], port=coms_db["port"], database=coms_db["database"])
              

            cursor = bdd.cursor()
            cursor.execute(f'''UPDATE commentaires SET avis_perso = "{sentiment}" WHERE id = {id};''')
            bdd.commit()
            cursor.close()
            bdd.close()

            return jsonify({'message': 'Modification réalisée !'})
        

    
@app.route('/archives', methods=['GET'])
def archives():
    if request.method == 'GET':
        bdd = mysqlpy.connect(user=coms_db["user"], password=coms_db["password"],
                                  host=coms_db["host"], port=coms_db["port"], database=coms_db["database"])
       
        cursor = bdd.cursor()
        cursor.execute(
            f'''SELECT * FROM commentaires ORDER BY date DESC;''')
        commentaires = cursor.fetchall()

        commentaires_list = []
        for commentaire in commentaires:
            commentaires_list.append({
                "id": commentaire[0],
                "date": commentaire[1],
                "commentaire": commentaire[2],                
                "sentiment": commentaire[4],
                "avis_IA": commentaire[3]
            })

        cursor.close()
        bdd.close()

        # fait à la demande de Nadine pour une présentation vidéo, mais mySQL entrait en conflit avec la capture vidéo, du coup, j'ai donné l'illusion que les commentaires étaient conservés !
        # commentaires_list = [
        #     {
        #     "id":0,
        #     "date": "Fri, 03 Feb 2023 15:11:15 GMT",
        #     "commentaire": "«ASTERIX ET OBELIX : L’EMPIRE DU MILIEU» aurait pu être une véritable bonne comédie doubler d’un bon film d’aventure dans les mains de scénaristes talentueux. A l’inverse, il n’est qu’une suite de scénettes poussives, peu drôles. On ne repassera pas sur tout les messages modernes du film de Guillaume Canet qui agace et dont on ne comprends pas trop l’intérêt (notamment autour du véganisme et féminisme). Les décors sont beaux même si la 3D se ressent trop et hormis en effet José Garcia qui m’a fait sourire et ceux dès la bande annonce et peut-être Cassel, le reste est raté. Une véritable catastrophe qui confirme que MISSION CLEOPATRE et à la limite AU SERVICE DE SA MAJESTE resteront les deux meilleurs films de la saga live-action Astérix.",
        #     "sentiment": 0,
        #     "avis_IA": 0
        #     },
        #     {
        #     "id":1,
        #     "date": "Fri, 03 Feb 2023 15:11:05 GMT",
        #     "commentaire": "«Superbe comédie française, une bonne dose d'humour ! On ne s'attend pas forcément à certaines scènes mais c'est bien de prendre des risques, c'est drôle et réussi, et parfait pour le regarder en famille ! Manu Payet dans Rikiki : magnifique !",
        #     "sentiment": 1,
        #     "avis_IA": 1
        #     },
        #     {
        #     "id":2,
        #     "date": "Fri, 03 Feb 2023 15:11:05 GMT",
        #     "commentaire": "«Arrêtons de prendre les gens pour ce qu'ils ne sont pas! Cet Astérix et Obelix est tout simplement médiocre. Un humour bancale, des cameos inutiles. Le cinéma Français ne brille pas avec ce genre de film, il s'enfonce même dans les abîmes des navets. Ce film est fait pour les gamins jusqu'à l'adolescence pas plus. On dirait une compilation de sketchs ratés plus mauvais les uns que les autres. Avec un budget avoisinant les 70 millions d'euros, on sait tout de suite ou est passé l'argent, dans les salaires des acteurs. Les décors sont idéaux, costumes en plastique, effets spéciaux immondes. Enfin bref passez votre chemin.",
        #     "sentiment": 0,
        #     "avis_IA": 0
        #     },
        #     {
        #     "id":3,
        #     "date": "Fri, 03 Feb 2023 15:11:05 GMT",
        #     "commentaire": "En voyant les critiques très mauvaise du film, j ai faillit renoncer à aller le voir.Mon mari m a forcé la main et je ne le regrette pas,moment de détente absolue avec de supers acteurs qui s amusent beaucoup eux aussi, des passages tendres et émotions et des jeux de mots caractéristiques de la bd.Alors je pense qu il y a des pseudo intelectuels qui veulent détruire guillaume canet.Moi en tout cas j ai passé un très bon moment avrc un film sans vulgarité contrairement aux grosses oeuvres comiques française",
        #     "sentiment": 1,
        #     "avis_IA": 1
        #     },
        #     ]

        return jsonify(commentaires_list)

@app.route('/scrapping/commentaires', methods=['POST'])
def scrapping():
    if request.method == 'POST':
        data = request.get_json()
        num_film = data['numFilm']
        titre_film = titre_film_allocine(num_film)     
        
        commentaires = web_scrapping(num_film)

        commentaires_titre = {
            'titre': titre_film,
            'commentaires': commentaires
        }

        return jsonify(commentaires_titre)

if __name__ == '__main__':
    app.run(debug=True)

#code pour lancer le serveur sans devoir le redémarrer à chaque fois : flask --app server.py --debug run