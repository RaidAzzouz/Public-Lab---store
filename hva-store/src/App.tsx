import "./App.css";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
};

const product: Product = {
  id: 1,
  title: "Headphones",
  price: 79.99,
  stock: 12,
  thumbnail: "https://placehold.co/200x160/4f46e5/fff?text=Headphones",
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function App() {
  return (
    <div className="wrapper">
      <header className="header">
        <span className="header-logo">HvA Store</span>
      </header>

      <main className="page">
        <h1 className="page-title">Welcome to HvA Store</h1>
        <p className="page-subtitle">Your products will appear here soon.</p>

        <div className="card">
          <img src={product.thumbnail} alt={product.title} />

          <div className="card-body">
            <p className="card-title">{product.title}</p>

            <p className="card-price">{formatPrice(product.price)}</p>

            <p className={`card-stock ${product.stock === 0 ? "out" : ""}`}>
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} HvA Store
      </footer>
    </div>
  );
}

export default App;