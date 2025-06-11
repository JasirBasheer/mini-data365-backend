from sklearn.ensemble import RandomForestClassifier
   import pandas as pd
   import joblib
   import sys
   import json

   data = pd.DataFrame({
       'follower_growth_rate': [0.01, 0.5, 0.02, 0.1, 0.4],
       'engagement_rate': [2.5, 0.5, 3.0, 1.0, 0.2],
       'comment_to_like_ratio': [0.1, 0.01, 0.15, 0.05, 0.02],
       'fraud': [0, 1, 0, 0, 1]
   })

   X = data.drop('fraud', axis=1)
   y = data['fraud']
   model = RandomForestClassifier()
   model.fit(X, y)
   joblib.dump(model, 'fraud_model.joblib')

   def detect_fraud(follower_growth_rate, engagement_rate, comment_to_like_ratio):
       model = joblib.load('fraud_model.joblib')
       features = [[follower_growth_rate, engagement_rate, comment_to_like_ratio]]
       score = model.predict_proba(features)[0][1] * 100
       return score

   if __name__ == "__main__":
       inputs = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
       if inputs:
           score = detect_fraud(
               inputs.get('follower_growth_rate', 0),
               inputs.get('engagement_rate', 0),
               inputs.get('comment_to_like_ratio', 0)
           )
           print(json.dumps({'fraud_score': score}))
       else:
           print(json.dumps({'error': 'No input provided'}))