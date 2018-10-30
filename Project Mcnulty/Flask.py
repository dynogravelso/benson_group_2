from flask import Flask
import flask
from sklearn.linear_model import LogisticRegression
import pprint, pickle
import sklearn.externals.joblib
import pandas as pd
import json

# clf = joblib.load('/Users/meenaa/Downloads/model.pkl')
model_col= pickle.load(open("model_col.pkl","rb"))
dt = pickle.load(open("DecisionTree.pkl","rb"))

# clf = pickle.load(pkl_file)

# Let's turn this into an API where you can post input data and get
# back output data after some calculations.

# If a user makes a POST request to http://127.0.0.1:5000/predict, and
# sends an X vector (to predict a class y_pred) with it as its data,
# we will use our trained LogisticRegression model to make a
# prediction and send back another JSON with the answer. You can use
# this to make interactive visualizations.

# Initialize the app
app = flask.Flask(__name__)

# Homepage
@app.route("/")
def viz_page():
    """
    Homepage: serve our visualization page, awesome.html
    """
    with open("/Users/meenaa/Downloads/awesome.html", 'r') as viz_file:
        return viz_file.read()
    

@app.route('/score', methods=['GET'])
def score():
    if dt:
        # data = flask.request.json
        json_str = '{"DAYS_BIRTH":10000,"CREDIT_TERM":50,"DAYS_EMPLOYED":1000}'
        df = pd.read_json(json_str,typ='Series')
        df_frame= df.to_frame(name='values')
        df1_transposed = df_frame.T
        query = pd.get_dummies(df1_transposed)

        # https://github.com/amirziai/sklearnflask/issues/3
        # Thanks to @lorenzori
        query = query.reindex(columns=model_col, fill_value=0)

        prediction = dt.predict_proba(query)
        results = {"predicted_value": prediction[0,1]}
        return flask.jsonify(results)
    
    else:
        print('train first')
        return('no model here')

@app.route('/pred', methods=['POST'])
def pred():
    if dt:
        #print("flask.request.json" + flask.request.json)
        #data = flask.request.json
        #df = pd.DataFrame.from_dict(data)
        #query = pd.get_dummies(df)

        json_str = json.dumps(flask.request.json)
        print("json_str:" + json_str)
        
        df = pd.read_json(json_str,typ='Series')
        df_frame= df.to_frame(name='values')
        df1_transposed = df_frame.T
        query = pd.get_dummies(df1_transposed)

        # https://github.com/amirziai/sklearnflask/issues/3
        # Thanks to @lorenzori
        query = query.reindex(columns=model_col, fill_value=0)
        print(query)

        prediction = dt.predict_proba(query)
        results = {"predicted_value": "{0:.0%}".format(prediction[0,1])}
        return flask.jsonify(results)
    
    else:
        print('train first')
        return('no model here')

# Start the server, continuously listen to requests.
# We'll have a running web app!

# For local development:
#--------- RUN WEB APP SERVER ------------#

# Start the app server on port 80
# (The default website port)
app.run(host='0.0.0.0')
app.run(debug=True)
