import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Guestbook() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setItems(await res.json());
      setStatus("");
    } catch {
      setStatus("Не вдалося завантажити відгуки. Перевірте URL API та CORS.");
    }
  }

  useEffect(() => {
    if (API) load();
    else setStatus("Не задано VITE_API_URL.");
  }, []);

  async function submit(e) {
    e.preventDefault();
    setStatus("Надсилаємо…");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setText("");
      await load();
      setStatus("Відгук збережено.");
    } catch {
      setStatus("Не вдалося надіслати відгук. Спробуйте ще раз.");
    }
  }

  return (
    <section>
      <h2>Книга відгуків</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Ім'я
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
        </label>
        <label>
          Відгук про сайт
          <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={500} rows={3} required />
        </label>
        <button className="btn" type="submit">Залишити відгук</button>
      </form>
      {status && <p role="status">{status}</p>}
      <ul className="projects">
        {items.map((it) => (
          <li key={it.id}>
            <h3>{it.name}</h3>
            <p>{it.text}</p>
            <small>{new Date(it.createdAt).toLocaleString("uk-UA")}</small>
          </li>
        ))}
        {items.length === 0 && !status && <li><p>Поки що відгуків немає. Будьте першим.</p></li>}
      </ul>
    </section>
  );
}
