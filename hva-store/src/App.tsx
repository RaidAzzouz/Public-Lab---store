import "./App.css";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "Headphones",
    price: 79.99,
    stock: 12,
    thumbnail: "https://placehold.co/200x160/4f46e5/fff?text=Headphones",
  },
  {
    id: 2,
    title: "Wireless Mouse",
    price: 24.95,
    stock: 30,
    thumbnail: "https://placehold.co/200x160/0ea5e9/fff?text=Mouse",
  },
  {
    id: 3,
    title: "Mechanical Keyboard",
    price: 119.0,
    stock: 0,
    thumbnail: "https://placehold.co/200x160/dc2626/fff?text=Keyboard",
  },
  {
    id: 4,
    title: "USB-C Hub",
    price: 39.5,
    stock: 7,
    thumbnail: "https://placehold.co/200x160/16a34a/fff?text=USB-C+Hub",
  },
  {
    id: 5,
    title: "27\" Monitor",
    price: 249.99,
    stock: 3,
    thumbnail: "https://placehold.co/200x160/f59e0b/fff?text=Monitor",
  },
];

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

        <div className="product-grid">
          {products.map((product) => (
            <div className="card" key={product.id}>
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
          ))}
        </div>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} HvA Store
      </footer>
    </div>
  );
}

export default App;