fetch("https://type.fit/api/quotes")
.then(response => {
		return response.json();
	})
	.then(datos => {
		let q = Math.floor(Math.random() * datos.length);
		let quote = datos[q];
		quote.author == null ? author = "Anonimous" : author = quote.author;

		const div_quote = document.getElementById("div_quote");
		div_quote.innerHTML = `<p class="quote__text">${quote.text}<p>
							   <p class="quote__author">${author}<p>`
	})
.catch(err => {
		console.error(err);
	});