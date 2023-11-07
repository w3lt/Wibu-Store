# Wibu-Store
This store sells wibu game (for everyone ofc) :>

### Install instruction
```
git clone gh repo clone riverlis/Wibu-Store
cd Wibu-Store
touch key.txt # Create a stripe key file
```
Then open the key.txt file (by whichever text editor you want) and the push in it the stripe public key and stripe secret key. First, you push the secret key and then the public key in the next line. Please be careful with the order. Here is and example:
```
# in file key.txt. Please do not copy these test keys
sk_test_51NsNMwJqOqW5UsDeG7q0qN1nEyj6BhcTYcyaNzXXQhtBM86S0CJ2zCs9lzuY6gEHKfmlLAmkx3VSn4fJk3Tsz29L00nOQTJunp
pk_test_51NsNMwJqOqW5UsDeY4l4UeBtEMW1Cz7fUnr5Uk0FloPFFGKAmWs7x3OYeQciF55V3qUzfnICFxQOmWlrh1g21QWx00R8Mc5pHQ
```
Then save it, and create docker compose by (if you did not install docker, please visit [docker](https://www.docker.com)):
```
docker-compose up -d
```
Here we go!
Good luck :>
