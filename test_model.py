# import joblib
from joblib import load

# sample customer details
data = [[0, 3, 6077, 0, 0, 0, 6077, 3]]
# load the saved pipleine model
pipeline = load("best_model.pkl")

# predict on the sample tweet text
print(pipeline.predict(data))
