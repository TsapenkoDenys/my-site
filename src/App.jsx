import { useState } from "react";
import Guestbook from "./Guestbook.jsx";

const projects = [
  { title: "Трекер звичок", text: "Невеликий застосунок для щоденних звичок. React + localStorage." },
  { title: "Погода у моєму місті", text: "Прогноз на тиждень із відкритого API." },
  { title: "Список покупок", text: "Спільний список для родини, працює офлайн." },
];

export default function App() {
  const [liked, setLiked] = useState(0);

  return (
    <main>
      <header className="hero">
        <h1>Привіт, я Олена.</h1>
        <p>Роблю невеликі вебзастосунки та пишу про те, як вони влаштовані.</p>
        <button className="btn" onClick={() => setLiked(liked + 1)}>
          Подобається сайт: {liked}
        </button>
      </header>

      <section>
        <h2>Проєкти</h2>
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Guestbook />

      <footer>
        <h2>Контакти</h2>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </footer>
    </main>
  );
}
