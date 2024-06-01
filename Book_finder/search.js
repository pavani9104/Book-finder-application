document.addEventListener("DOMContentLoaded", () => {
    const sbutton = document.getElementById("search_button");
    const input = document.getElementById("search_input");
    const loader = document.getElementById("loading");
    const result = document.getElementById("results");
    const main_page = document.getElementById("search_books");
    const image = document.getElementById("book");
    const msg = document.getElementById("message");

    sbutton.addEventListener("click", async () => {
        const search_book = input.value.trim();
        if (search_book === "") {
            alert("Please enter a book!");
            return;
        }
        loader.style.display = "block";
        result.innerHTML = "";
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search_book}`);
            const data = await response.json();
            display(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            loader.style.display = "none";
            result.innerHTML = "<p>Error fetching data. Please try again later.</p>";
        }
    });

    function display(data) {
        loader.style.display = "none";
        main_page.style.display = "none";
        image.style.display = "none";
        msg.innerHTML = `
            <p>Here are the results for your search!</p>
            <a href="search.html">Go back to Search</a>
        `;
        if (!data || data.items.length === 0) {
            result.innerHTML = "<p>No Results Found</p>";
            return;
        }

        const books = data.items.map(item => {
            const volumeInfo = item.volumeInfo;
            const title = volumeInfo.title || "Unknown Title";
            const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";
            const category = volumeInfo.categories ? volumeInfo.categories.join(", ") : "Unknown Category";
            const thumbnail = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150";
            const infoLink = volumeInfo.infoLink || "#";

            return `
                <div class="result_books">
                    <img src="${thumbnail}" alt="${title}">
                    <h3>${title}</h3>
                    <p><strong>Author(s):</strong> ${authors}</p>
                    <p><strong>Category:</strong> ${category}</p>
                    <a href="${infoLink}" target="_blank">View Details</a>
                </div>
            `;
        }).join("");

        result.innerHTML = books;
    }
});
