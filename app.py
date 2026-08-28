from flask import Flask, render_template

app = Flask(__name__, static_folder="templates/static", static_url_path="/static")


@app.after_request
def add_security_headers(response):
	response.headers["X-Content-Type-Options"] = "nosniff"
	response.headers["X-Frame-Options"] = "DENY"
	response.headers["Referrer-Policy"] = "no-referrer"
	return response


@app.route("/")
def home():
	return render_template("index.html")


if __name__ == "__main__":
	app.run(debug=True)
